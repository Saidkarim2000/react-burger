export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TOrderStatus = 'created' | 'pending' | 'done';

export type TOrder = {
  _id: string;
  number: number;
  name?: string;
  status: TOrderStatus;
  ingredients: string[];
  createdAt: string;
  updatedAt: string;
};

export type TOrderFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};
