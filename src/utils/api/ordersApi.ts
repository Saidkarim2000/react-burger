import { burgerIngredientsApi } from './api';
import { API } from './client';

import type { TOrder, TOrderFeed } from '../types';

type TFeedState = {
  feed: TOrderFeed | null;
  error: string | null;
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

function parseFeed(message: string): TOrderFeed | null {
  let data: unknown;

  try {
    data = JSON.parse(message);
  } catch {
    return null;
  }

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

            const feed = parseFeed(event.data);

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
  }),
});

export const { useGetPublicFeedQuery } = ordersApi;
