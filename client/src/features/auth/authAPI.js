import axios from "axios";

const headers = {
    'Content-Type': 'application/json',
    'Authorization': JSON.parse(localStorage.getItem('token'))
}

// register
const register = async (userData) => {
    try{
        const res = await axios.post("/signup", userData)
        return res.data
    }catch(err){
        return err.response.data
    } 
};

const login = async (userData) => {
    try{
        const res = await axios.post("/signin", userData)
        if (res.data.token) {
            localStorage.setItem('token', JSON.stringify(res.data.token))
        }
        return res.data
    }catch(err){
        return err.response.data
    } 
}

const ChangePassword = async (userData) => {
    try{
        const res = await axios.put("/changepassword", userData, {headers:headers});
        console.log("res",res.data.entry);
        return res.data.entry
    }catch(err){
        console.log("err",err.response.data);
        return err.response.data
    } 
}

const ForgotPassword = async (email) => {
    try{
        const res = await axios.post("/forgotpassword", email);
        console.log("res",res.data);
        return res.data.entry
    }catch(err){
        console.log("err",err.response.data);
        return err.response.data
    } 
}

const checkRecoverToken = async (token) => {
    try{
        const res = await axios.post("/checkrecovertoken", {token});
        return res.data.entry
    }catch(err){
        console.log("err",err.response.data);
        return err.response.data
    } 
}

const RecoverPassword = async (userData) => {
    try{
        const res = await axios.put("/recoverpassword", userData);
        console.log("res",res.data);
        return res.data.entry
    }catch(err){
        console.log("err",err.response.data);
        return err.response.data
    } 
}

const logout = () => {
    localStorage.removeItem('token')
  }

const authAPI = {
  register,
  login,
  logout,
  ChangePassword,
  ForgotPassword,
  checkRecoverToken,
  RecoverPassword
};

export default authAPI;
