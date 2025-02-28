export interface DeveloperAttributes {
  Name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface Developer {
  id: number;
  attributes: DeveloperAttributes;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface Meta {
  pagination: Pagination;
}

export interface DevelopersRequest {
  data: Developer[];
  meta: Meta;
}
