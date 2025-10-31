export const loginUser = async ( phone, password) => {
    const loginDetails = {phone : phone, password: password};
    try{
        const res = await fetch("http://localhost:7070/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(loginDetails),
        });
        const data = await res.json();
        return data;
    }catch(err){
        console.error("Login failed:", err);
        return {success: false, message: err.message};
    }
};
export const verifyLogin = async () => {
    try {
        const res = await fetch("http://localhost:7070/login/verify", {
            method: "POST",
            credentials: "include"
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Verify failed:", err);
        return {success: false, message: "Verification request failed"};
    }
};

export const logoutUser = async () => {

    try {
        const res = await fetch("http://localhost:7070/login/logout", {
            method: "POST",
            credentials: "include",
        });
        const data = await res.json();
        if (data.success)
            return data;
    } catch (err) {
        console.error("Logout failed:", err);
        return {success: false, message: err.message};
    }
};