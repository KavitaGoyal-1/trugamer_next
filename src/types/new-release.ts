import { IGame, ImageData, ReleaseByPlatforms } from "./game";

export interface INewRelease {
  id: number;
  release: any;
  attributes: {
    coverImage: ImageData;
    image: ImageData;
    releaseByPlatforms?: ReleaseByPlatforms;
    slug: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    release_date: string;
    game: { data: IGame };
  };
}
