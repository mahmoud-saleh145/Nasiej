declare type APIResponse<T> = SuccessfulResponse<T> | ErrorResponse;

declare type SuccessfulResponse<T> = {
    msg: "success";

} & T

declare type ErrorResponse = {
    msg: 'error'
    err: string;
};


// -------------------------wishlist-------------------------
declare type ToggleWishlist<T> = SuccessfulToggle<T> | ErrorToggle<T>;

declare type SuccessfulToggle<T> = {
    added: boolean
    msg: "Item added to wishlist";

} & T

declare type ErrorToggle<T> = {
    added: boolean
    msg: 'Item removed from wishlist'

} & T

interface WishList {
    productId: ProductDetails
}

interface wishListFetch {
    wishList: {
        _id: string
        sessionId: string
        userId: string, null
        items: WishList[]
    }
}
interface EmptyWishlist {
    msg: "success"
    wishList: []
}

// ------------------------order---------------------------
type OrderStatus = "placed" | "shipping" | "delivered"
interface OrderResponse {
    order: Order
}

interface Order {
    _id: string;
    userId: string;
    products: OrderProduct[];
    shippingCost: number;
    subtotal: number;
    totalPrice: number;
    status: OrderStatus;
    email: string;
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    city: string,
    governorate: string,
    paymentMethod: string;
    orderNumber: number;
    randomId: string;
    couponCode?: string;
    createdAt: string;
    updatedAt?: string;
}

interface OrderProduct {
    productId: ProductDetails
    quantity: number
    price: number
    color?: string
}
interface CompleteOrder {
    msg: string,
    order: Order
}


interface EditOrderModalProps {
    status: OrderStatus;
    onSave: (status: OrderStatus) => void;
    onClose: () => void;
}



// ----------------------product----------------------
interface VariantImage {
    url: string;
}

interface Variant {
    color: string;
    images: VariantImage[];
    stock: number;
    reserved: number;
}

type VariantMeta = {
    color: string;
    stock?: number;
    fileIndexes: number[];
};

interface ProductDetails {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    variants: Variant[];
    brand: string;
    discount: number;
    raise: number;
    hide: boolean;
    priceBeforeDiscount?: number;
    finalPrice?: number;
    createdAt: string;
    updatedAt?: string;

}

interface Product {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    products: ProductDetails[];
}

interface ProductResponse {
    product: ProductDetails
}


// --------------------------cart-------------------------------
declare type EditCartResponse = EditCart | OutOfStock;

interface CartResponse {
    subtotal: number
    totalQuantity: number
    cart: Cart
}
interface Cart {
    _id: string;
    sessionId: string;
    userId: CartUserId | null;
    items: CartItem[];
    createdAt: string,
    updatedAt: string,
}
interface CartUserId {
    _id: string;
    email: string;
    phone: string;
}

interface CartItem {
    productId: ProductDetails;
    quantity: number;
    color?: string;
}

interface EditCart {
    msg: "success"
    cart: Cart[]
}
interface OutOfStock {
    msg: "No more stock available for this product"
    stockLimitReached: boolean
}

interface CartQuantityResponse {
    totalQuantity: number;
}



// ------------------brand category----------------
interface Brand {

    brands: {
        count: number;
        brand: string
    }[]
}
interface Category {

    categories: {
        count: number;
        category: string
    }[]
}


// ---------------------user--------------------
interface LoginUser {
    msg: "success"
    token: string
    user: User
}



interface TokenPayload extends jwt.JwtPayload {
    id: string;
    role: string;
    iat: number; // issued at
    exp: number; // expiration time
}

interface StatusTokenResponse {
    loggedIn: boolean;
    user?: TokenPayload;
    role?: string;
}




