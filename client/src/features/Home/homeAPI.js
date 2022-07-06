import axios from "axios";


// view all books
const viewAllBooks = async (userData) => {
    try{
        const res = await axios.post("/viewAllBooks", userData)
        return res.data.Items
    }catch(err){
        return err.response.data
    } 
};


const homeAPI = {
    viewAllBooks,
};
  
export default homeAPI;