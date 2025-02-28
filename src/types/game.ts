// import { CategoryData } from "./Categories";
// import { Developer } from "./Developers";
import { CategoryData } from "./categories";
import { Developer } from "./developers";
import { Link } from "./link";
import { Store } from "./store";

export interface Release {
  id: number;
  releaseDate: string;
  device?: {
    data: {
      id: number;
      attributes: {
        name: string;
        slug: string;
        publishedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        icon: any;
      };
    };
  };
}

export interface ReleaseByPlatforms {
  id: number;
  release: Release[];
}

export interface GameImage {
  name: string;
  alternativeText: string;
  caption?: any;
  width: number;
  height: number;
  formats: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: any;
  provider: string;
  provider_metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Data {
  id: number;
  attributes: GameImage;
}

export interface ImageData {
  data: Data;
  url?: string;
}

export interface IGameAttributes {
  title: string;
  description: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  hoursToComplete?: number;
  rating?: number;
  played?: string;
  queued?: string;
  releaseByPlatforms?: ReleaseByPlatforms;
  image: ImageData;
  coverImage: ImageData;
  developer?: {
    data: Developer;
  };
  publisher?: {
    data: Publisher;
  };
  links?: Link[];
  stores?: Store[];
  beat?: string;
  categories?: {
    data: CategoryData[];
  };
  related_games?: {
    data: IGame[];
  };
  devices: any;
  game_preview?: GamePreview[];
  videos?: [];
  editorialAnticipatedRelease?: Boolean;
}

interface Preview {
  thumbnail: string;
  mime: string;
  title: string;
  url: string;
  rawData: {
    author_name: string;
    height: number;
    [key: string]: any;
  };
}

export interface GamePreview {
  id: number;
  tag: string;
  title: string;
  link: string | Preview;
  preview: {
    data: {
      id: number;
      attributes: {
        url: string;
      };
    };
  };
}

export interface Publisher {
  id: number;
  attributes: {
    Name: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
  };
}

export interface IGame {
  id: number;
  attributes: IGameAttributes;
}

export interface IGameLibrary {
  id: number;
  releaseByPlatforms: any;
  image: any;
}

export interface IReview {
  id: number;
  rating: number;
  review: string;
  review_title: string;
  user?: {
    name: string;
    username: string;
    id: number;
    picture: {
      url: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
