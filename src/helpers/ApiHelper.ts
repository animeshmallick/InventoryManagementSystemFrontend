import axios from "axios";
import API_CONFIG from "@/config/apiConfig";
import {LoginDetails, LoginResponse, VerifyLoginResponse, LogoutResponse, AddProductRequest, AddProductResponse} from "@/blueprint/blueprint";


const api = axios.create({
    baseURL: API_CONFIG.getBaseUrl(),
    method: "post",
    withCredentials: true,
    headers: {"Content-Type": "application/json"}
});

const ApiHelper = {
    async loginUser(loginDetails: LoginDetails) : Promise<LoginResponse> {
            const res : LoginResponse = await api.post("/login", loginDetails);
            return res;
    },
    async verifyLogin() :Promise<VerifyLoginResponse> {
            const res = await api.post("/login/verify");
            return res.data;
    },
    async logoutUser(): Promise<LogoutResponse> {
            const res : LogoutResponse = await api.post("/login/logout");
            return res;
    },
    async getAllProducts(){
            const res = await api.post("/allProducts");
            return res.data;
    },
    async addProduct(productData:AddProductRequest):Promise<AddProductResponse>{
        try{
            const res = await api.post("/addProduct", productData);
            return res.data;
        }catch(err){
            console.error("Error Adding Product: ", err);
            throw err;
        }
    },

};
export default ApiHelper;