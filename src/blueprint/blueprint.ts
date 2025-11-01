export interface User {
    userId: string;
    userRole: string;
}
export interface LoginDetails {
    phone: string;
    password: string;
}
export interface LoginResponse {
    // data:{
        success: boolean;
        message: boolean;
        user?: User;
    // };
}
export interface VerifyLoginResponse {
        success: boolean;
        loggedIn: boolean;
        user: User;
}
export interface LogoutResponse {
        success: boolean;
        message: string;
}
export interface AddProductRequest {
    productName: string;
    productQuantity: number;
    productPrice: number;
}
export interface AddProductResponse {
    message: string;
    product: {
        product_id: string;
        productName: string;
        productStock: number;
        productPrice: number;
        createdBy: string;
        lastUpdatedAt: string;
    };
}
export interface Product {
    product_id: string;
    productName: string;
    productStock: number;
    productPrice: number;
    createdBy: string;
    lastUpdatedAt: string;
}
export interface SelectedProduct {
    productName: string;
    productQuantity: number;
    productPrice: number;
}