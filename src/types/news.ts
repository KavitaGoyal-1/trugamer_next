import { IGameAttributes } from "./game";

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface News {
  id: number;
  title: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  comments: Comments;
  description: string;
  coverImage: ImageAttributes;
  slug: string;
  comment_count?: number;
  author: Author;
  related_game: IGameAttributes;
  news: News[];
  news_tags?: NewsTagsAttributes[];
}

export interface NewsTags {
  id: number;
  attributes: NewsTagsAttributes;
}

export interface NewsTagsAttributes {
  createdAt: string;
  tag: string;

  icon: ImageAttributes;
}

export interface Author {
  id: number;
  name: string;
  avatar: string;
}

export interface Comments {
  populate: string[];
  renderType: string;
  sortByDate: string;
  commentsNumber: number;
}

export interface CoverImage {
  data: Data;
}

export interface Data {
  id: number;
  attributes: ImageAttributes;
}

export interface ImageAttributes {
  name: string;
  alternativeText: null;
  caption: null;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Formats {
  large: Large;
  small: Large;
  medium: Large;
  thumbnail: Large;
}

export interface Large {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
}

export interface Tag {
  id: number;
  tags: string;
}

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coverImage: {
    id: number;
    name: string;
    width: number;
  };
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
}
