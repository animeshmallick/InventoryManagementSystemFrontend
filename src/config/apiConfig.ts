const API_CONFIG = {
    ENV:"LOCAL",
    PROD_HOST: "https://api.quickchoice.in",
    LOCAL_HOST: "http://localhost",
    LOCAL_PORT: 7070,


    getBaseUrl(){
        return this.ENV === "LOCAL"
            ?`${this.LOCAL_HOST}:${this.LOCAL_PORT}`
            :`${this.PROD_HOST}`;
    }

};
export default API_CONFIG;