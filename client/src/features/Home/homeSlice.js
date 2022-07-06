import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import homeAPI from './homeAPI';

const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    allBooksData:[]
}

export const viewAllBooks = createAsyncThunk('home/viewAllBooks',async (thunkAPI)=>{
    try{
        let response = await homeAPI.viewAllBooks();
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response
        }
    }catch(error){
        const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const homeSlice = createSlice({
    name:'home',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading=false
            state.isSuccess=false
            state.isError=false
            state.message=''
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(viewAllBooks.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(viewAllBooks.fulfilled,(state,action)=>{
            state.isLoading=true
            state.isSuccess=true
            state.allBooksData=action.payload
            state.message='done'
        })
        .addCase(viewAllBooks.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })
    }
})

export const {reset} = homeSlice.actions
export default homeSlice.reducer
