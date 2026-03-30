export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface ProductsSectionProps {
  products: Product[];
  page: number;
  total: number;
  totalPages: number;
  pageNumbers: number[];
  itemsPerPage: number;
  onPageChange: (nextPage: number) => void;
}
