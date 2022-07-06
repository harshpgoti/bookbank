import axios from "axios";

const uploadfile = async (fileData) => {
    try{
        const res = await axios.post("/upload", fileData,{headers:{
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': JSON.parse(localStorage.getItem('token'))
        }})
        return res.data
    }catch(err){
        return err.response.data
    } 
};

const viewfile = async () => {
    try{
        const res = await axios.post("/viewbooks",{},{headers:{'authorization': JSON.parse(localStorage.getItem('token'))}});
        return res.data
    }catch(err){
        return err.response.data
    } 
};

const updatefile = async (fileData) => {
    try{
        const res = await axios.post("/updatebookdetails",fileData,{headers:{
            'accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': JSON.parse(localStorage.getItem('token'))
        }})
        return res.data
    }catch(err){
        return err.response.data
    } 
};

const deletefile = async (fileData) => {
    try{
        const res = await axios.delete("/deleteFile",{data:{fileData,headers:{'authorization': JSON.parse(localStorage.getItem('token'))}}});
        return res.data
    }catch(err){
        return err.response.data
    } 
};

const fileAPI = {
    uploadfile,
    viewfile,
    updatefile,
    deletefile,
};
  
export default fileAPI;