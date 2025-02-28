export interface Attributes2 {
    name: string;
    alternativeText: string;
    caption?: any;
    width: number;
    height: number;
    formats?: any;
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

export interface Datum {
    id: number;
    attributes: Attributes2;
}

export interface Icon {
    data: Datum[];
}

export interface ContactMean {
    id: number;
    title: string;
    description: string;
    value: string;
    icon: Icon;
}

export interface Attributes3 {
    name: string;
    alternativeText: string;
    caption?: any;
    width: number;
    height: number;
    formats?: any;
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

export interface Data2 {
    id: number;
    attributes: Attributes3;
}

export interface Icon2 {
    data: Data2;
}

export interface SocialIcon {
    id: number;
    icon: Icon2;
}

export interface IAttributes {
    intro: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    contactMeans: ContactMean[];
    social_icons: SocialIcon[];
    formTitle: string;
    formMessage: string;
    formEmail: string;
}

export interface IData {
    id: number;
    attributes: IAttributes;
}