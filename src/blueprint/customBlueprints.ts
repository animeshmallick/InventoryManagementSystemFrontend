export interface User {
    userId: string;
    userRole: string;
}
export interface LoginDetails {
    phone: string;
    password: string;
}
export interface Product {
    product_id: string;
    productName: string;
    productCategory: string;
    productStock: number;
    productCostPrice: number;
    productSellingPrice: number
    createdBy: string;
    lastUpdatedAt: string;
}