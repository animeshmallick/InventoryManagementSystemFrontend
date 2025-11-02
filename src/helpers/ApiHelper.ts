import axios from "axios";
import API_CONFIG from "@/config/apiConfig";
import {
    LoginDetails,
    LoginResponse,
    VerifyLoginResponse,
    LogoutResponse,
    AddProductRequest,
    AddProductResponse,
    DeleteProductResponse
} from "@/blueprint/blueprint";


const api = axios.create({
    baseURL: API_CONFIG.getBaseUrl(),
    method: "post",
    withCredentials: true,
    headers: {"Content-Type": "application/json"}
});

const ApiHelper = {
    async loginUser(loginDetails: LoginDetails) : Promise<LoginResponse> {
        return api.post("/login", loginDetails)
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
    async addProduct(productData:AddProductRequest):Promise<AddProductResponse>{
        return api.post("/addProduct", productData)
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