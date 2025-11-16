import axios from "axios";
import API_CONFIG from "@/config/apiConfig";
import {LoginResponse,
        VerifyLoginResponse,
        LogoutResponse,
        AddProductResponse,
        DeleteProductResponse,
        UpdateInventoryResponse,
        UpdateProductResponse,
        GetPastTransactionsResponse,
        DeleteOrderResponse} from "@/blueprint/blueprint";
import {Product} from "@/blueprint/customBlueprints";


const api = axios.create({
    baseURL: API_CONFIG.getBaseUrl(),
    method: "post",
    withCredentials: true,
    headers: {"Content-Type": "application/json"}
});

const ApiHelper = {
    async loginUser(phone: number, password: string) : Promise<LoginResponse> {
        return api.post("/login", {phone, password})
            .then(response => response.data)
            .catch(error => error.response.data);
    },
    async verifyLogin() :Promise<VerifyLoginResponse> {
        return api.post("/login/verify")
            .then(response => response.data)
            .catch(error => error.response.data);
    },
    async logoutUser(): Promise<LogoutResponse> {
        return api.post("/login/logout")
            .then(response => response.data)
            .catch(error => error.response.data);
    },
    async getAllProducts(){
        return api.post("/allProducts")
            .then(response => response.data)
            .catch(error => error.response.data);
    },
    async addProduct(
        productName: string,
        productCategory: string,
        productCostPrice: number,
        productSellingPrice: number
    ):Promise<AddProductResponse>{
        return api.post("/addProduct", {productName, productCategory, productCostPrice, productSellingPrice})
            .then(response => response.data)
            .catch(error => error.response.data);
    },
    async deleteProduct(productId: string):Promise<DeleteProductResponse>{
        return api.post(`/deleteProduct/${productId}`)
            .then(response => response.data)
            .catch(error => error.response.data);
    },
    async updateInventory(
        productId: string,
        productQuantity: number,
        requestType: string,
        unitPrice: number
    ): Promise<UpdateInventoryResponse> {
        return api.post("/updateInventory", {productId, productQuantity, unitPrice, requestType})
        .then(response => response.data)
        .catch(error => error.response.data);
    },
    async getProductById(productId: string | Array<string> | undefined): Promise<Product>{
        return api.post(`/getProduct/${productId}` )
        .then(response => response.data.product)
        .catch(error => error.response.data);
    },
    async updateProduct(
        productId: string | null,
        productName: string | null,
        productCategory: string | null,
        productSellingPrice: number | null
    ): Promise<UpdateProductResponse>{
        return api.post(`/updateProduct/${productId}`,{productId, productName, productCategory, productSellingPrice} )
        .then(response => response.data)
        .catch(error => error.response.data);
    },
    async getPastTransactions(productId: string | null):Promise<GetPastTransactionsResponse>{
        return api.post(`/getOrders/${productId}`)
        .then(response => response.data)
        .catch(error =>error.response.data);
    },
    async deleteOrder(orderId: string): Promise<DeleteOrderResponse>{
        return api.post(`/deleteOrder/${orderId}`)
        .then(response => response.data)
        .catch(error => error.response.data);
    }
};
export default ApiHelper;