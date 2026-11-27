import type { TOrder } from './types';

export const statusLabels: Record<TOrder['status'], string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};
