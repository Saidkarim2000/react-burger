import { burgerIngredientsApi } from './api';
import { API } from './client';
import { refreshToken } from './refreshToken';

import type { TOrder, TOrderFeed } from '../types';

type TFeedState = {
  feed: TOrderFeed | null;
  error: string | null;
};
type TOrderByNumberResponse = {
  success: boolean;
  orders: TOrder[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isValidDate(value: unknown): boolean {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function isOrder(value: unknown): value is TOrder {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value._id === 'string' &&
    value._id.trim().length > 0 &&
    isNonNegativeInteger(value.number) &&
    (value.name === undefined || typeof value.name === 'string') &&
    (value.status === 'created' ||
      value.status === 'pending' ||
      value.status === 'done') &&
    isValidDate(value.createdAt) &&
    isValidDate(value.updatedAt) &&
    Array.isArray(value.ingredients) &&
    value.ingredients.length > 0 &&
    value.ingredients.every(
      (id: unknown) => typeof id === 'string' && id.trim().length > 0
    )
  );
}

function parseMessage(message: string): unknown {
  try {
    return JSON.parse(message) as unknown;
  } catch {
    return null;
  }
}

function parseFeed(data: unknown): TOrderFeed | null {
  if (
    !isRecord(data) ||
    data.success !== true ||
    !Array.isArray(data.orders) ||
    !isNonNegativeInteger(data.total) ||
    !isNonNegativeInteger(data.totalToday)
  ) {
    return null;
  }

  return {
    orders: data.orders.filter(isOrder),
    total: data.total,
    totalToday: data.totalToday,
  };
}

const ordersApi = burgerIngredientsApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicFeed: builder.query<TFeedState, void>({
      queryFn: () => ({
        data: { feed: null, error: null },
      }),

      keepUnusedDataFor: 0,

      async onCacheEntryAdded(_arg, lifecycle) {
        let socket: WebSocket | undefined;

        try {
          await lifecycle.cacheDataLoaded;

          const url = new URL('/orders/all', API.url);
          url.protocol = 'wss:';

          socket = new WebSocket(url.href);

          socket.onmessage = (event: MessageEvent<unknown>): void => {
            if (typeof event.data !== 'string') {
              return;
            }

            const feed = parseFeed(parseMessage(event.data));

            if (feed) {
              lifecycle.updateCachedData(() => ({ feed, error: null }));
            }
          };

          socket.onclose = (): void => {
            lifecycle.updateCachedData((draft) => {
              draft.error = 'Соединение с лентой заказов прервано.';
            });
          };

          await lifecycle.cacheEntryRemoved;
        } catch {
          // Подписка может исчезнуть до создания первой записи в кэше.
        } finally {
          if (socket) {
            socket.onmessage = null;
            socket.onclose = null;
            socket.close();
          }
        }
      },
    }),
    getUserFeed: builder.query<TFeedState, string>({
      queryFn: () => ({
        data: { feed: null, error: null },
      }),

      keepUnusedDataFor: 0,

      async onCacheEntryAdded(_userEmail, lifecycle): Promise<void> {
        let socket: WebSocket | undefined;
        let disposed = false;
        let triedRefresh = false;

        function setError(message: string): void {
          lifecycle.updateCachedData((draft) => {
            draft.error = message;
          });
        }

        function closeSocket(): void {
          if (!socket) {
            return;
          }

          socket.onmessage = null;
          socket.onclose = null;
          socket.close();
          socket = undefined;
        }

        async function recoverSession(rejectedToken: string): Promise<void> {
          closeSocket();

          if (triedRefresh) {
            setError('Не удалось подтвердить сессию. Войдите повторно.');
            return;
          }

          triedRefresh = true;

          try {
            if (localStorage.getItem('accessToken') === rejectedToken) {
              const refreshed = await refreshToken();

              if (!refreshed.ok) {
                if (!disposed) {
                  setError('Не удалось обновить токен для истории заказов.');
                }
                return;
              }
            }

            if (!disposed) {
              connect();
            }
          } catch {
            if (!disposed) {
              setError('Не удалось восстановить соединение с историей заказов.');
            }
          }
        }
        function connect(): void {
          const accessToken = localStorage.getItem('accessToken');

          if (!accessToken) {
            setError('Для просмотра истории заказов требуется вход.');
            return;
          }

          const url = new URL('/orders', API.url);
          url.protocol = 'wss:';
          url.searchParams.set('token', accessToken.replace(/^Bearer\s+/i, ''));

          const connection = new WebSocket(url.href);
          socket = connection;

          connection.onmessage = (event: MessageEvent<unknown>): void => {
            if (typeof event.data !== 'string') {
              return;
            }

            const message = parseMessage(event.data);

            if (isRecord(message) && message.message === 'Invalid or missing token') {
              void recoverSession(accessToken);
              return;
            }

            const feed = parseFeed(message);

            if (feed) {
              triedRefresh = false;
              lifecycle.updateCachedData(() => ({ feed, error: null }));
            }
          };

          connection.onclose = (): void => {
            setError('Соединение с историей заказов прервано.');
          };
        }

        try {
          await lifecycle.cacheDataLoaded;
          connect();
          await lifecycle.cacheEntryRemoved;
        } catch {
          // Подписка могла исчезнуть до инициализации кэша.
        } finally {
          disposed = true;
          closeSocket();
        }
      },
    }),
    getOrderByNumber: builder.query<TOrder | null, number>({
      query: (number) => `/orders/${number}`,

      transformResponse: (
        response: TOrderByNumberResponse,
        _meta,
        number
      ): TOrder | null => {
        if (!response.success || !Array.isArray(response.orders)) {
          throw new Error('Некорректный ответ сервера');
        }

        return response.orders.find((order) => order.number === number) ?? null;
      },
    }),
  }),
});

export const { useGetPublicFeedQuery, useGetUserFeedQuery, useGetOrderByNumberQuery } =
  ordersApi;
