import { Data } from "./game";

export interface IDevice {
  id: number;
  attributes: {
    name: string;
    slug: string;
    icon: {
      id: string;
      alt: string;
      image: {
        data: Data;
      };
    };

    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
  };
}
