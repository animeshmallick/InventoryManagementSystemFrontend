import axios from "axios";
import API_CONFIG from "@/config/apiConfig";
import {LoginResponse, VerifyLoginResponse, LogoutResponse, AddProductResponse, DeleteProductResponse} from "@/blueprint/blueprint";


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
        productQuantity: number,
        productCostPrice: number,
        productSellingPrice: number
    ):Promise<AddProductResponse>{
        return api.post("/addProduct", {productName, productQuantity, productCostPrice, productSellingPrice})
            .then(response => response.data)
            .catch(error => error.response.data);
    },
    async deleteProduct(productId: string):Promise<DeleteProductResponse>{
        return api.post(`/deleteProduct/${productId}`)
            .then(response => response.data)
            .catch(error => error.response.data);
    }

};
export default ApiHelper;