declare type User = {

    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    city: string;
    governorate: string;
    role: string,
    orders: {
        orderId: Order;
    }[]
    createdAt: string;

}

declare interface LoginResponse {
    user: User,
}
