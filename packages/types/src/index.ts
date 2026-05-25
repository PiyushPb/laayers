export type BaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};
