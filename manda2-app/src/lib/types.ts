export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    image_url?: string;
    category_id?: string;
    is_weighted?: boolean;
}

export interface CartItem extends Product {
    qty: number;
}
