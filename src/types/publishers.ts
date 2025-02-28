export interface PublisherAttributes {
    Name: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
}

export interface Publisher {
    id: number;
    attributes: PublisherAttributes;
}