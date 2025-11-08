import {User,Product} from "@/blueprint/customBlueprints";
export interface LoginResponse {
        success: boolean;
        message: boolean;
        user?: User;
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
export interface AddProductResponse {
    message: string;
    product: Product;
}

export interface UpdateInventoryResponse {
    message: string;
    product: Product;
}
export interface SelectedProduct {
    productName: string;
    productQuantity: number;
    productCostPrice: number;
    productSellingPrice: number;
}
export interface DeleteProductResponse {
    message: string,
    product: Product[]
}