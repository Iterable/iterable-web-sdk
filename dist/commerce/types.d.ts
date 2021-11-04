interface CommerceItem {
    id: string;
    sku?: string;
    name: string;
    description?: string;
    categories?: string[];
    price: number;
    quantity: number;
    imageUrl?: string;
    url?: string;
    dataFields?: Record<string, any>;
}
interface CommerceUser {
    dataFields?: Record<string, any>;
    preferUserId?: boolean;
    mergeNestedObjects?: boolean;
}
export interface UpdateCartRequestParams {
    user?: CommerceUser;
    items: CommerceItem[];
}
export interface TrackPurchaseRequestParams {
    id?: string;
    user?: CommerceUser;
    items: CommerceItem[];
    campaignId?: string;
    templateId?: string;
    total: number;
    createdAt?: number;
    dataFields?: Record<string, any>;
}
export {};
