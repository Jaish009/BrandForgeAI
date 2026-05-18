

export type CreateListingType = {
    templateId: string;
    title: string;
    description: string;
    sellingPrice: number;
    colorIds: string[];
    artworkUrl: string;
    artworkPlacement: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
}

export type ColorIdsType = {
    id: string;
    name: string;
    color: string;
    mockupImageUrl: string;
}

export type ListingSingleType = {
    id: string;
    slug: string;
    title: string;
    description: string;
    sellingPrice: number;
    sizes: string[];
    templateName: string;
    templateBody: string;
    colorIds: ColorIdsType[];
    createdAt: string;
    updatedAt: string;
}

export type GetListingBySlugResponse = {
    message: string;
    listing: ListingSingleType;
}
