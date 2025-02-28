export interface CategoryAttributes {
    title: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
}

export interface CategoryData {
    id: number;
    attributes: CategoryAttributes;
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

export interface CategoryRequestResponse {
    data: CategoryData[];
    meta: Meta;
}