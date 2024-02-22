export type WrapperResponse<T> = Promise<{
  data: T;
}>;

export type WrapperMockResponse<T> = Promise<T>;

export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export type PinType = {
  id: string;
  name: string;
  icon: string;
  address: string;
  status: string;
  vote: number;
  note: string;
  image_url: string;
  location: number[];
  province: string;
};
