import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fileAPI from './fileAPI';

const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    userBooks:[],
    wantUpdateBook:{}
}

export const uploadfile = createAsyncThunk('file/uploadfile',async (data, thunkAPI)=>{
    try{
        let response = await fileAPI.uploadfile(data);
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response.entry
        }
    }catch(error){
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const viewfile = createAsyncThunk('file/viewfile',async (thunkAPI)=>{
    try{
        let response = await fileAPI.viewfile();
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response
        }
    }catch(error){
        const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updatefile = createAsyncThunk('file/updatefile',async (data, thunkAPI)=>{
    try{
        let response = await fileAPI.updatefile(data);
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response.entry
        }
    }catch(error){
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const deletefile = createAsyncThunk('file/deletefile',async (data, thunkAPI)=>{
    try{
        let response = await fileAPI.deletefile(data);
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response.entry
        }
    }catch(error){
        const message =
        (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const fileSlice = createSlice({
    name:'file',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading=false
            state.isSuccess=false
            state.isError=false
            state.message=''
        },
        setOldBook:(state,action)=>{
            state.wantUpdateBook=action.payload
        }
    },
    extraReducers:{
        [uploadfile.pending]:(state)=>{
            state.isLoading=true;
        },
        [uploadfile.fulfilled]:(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.message = action.payload;
        },
        [uploadfile.rejected]:(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        },
        [viewfile.pending]:(state)=>{
            state.isLoading=true;
        },
        [viewfile.fulfilled]:(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.userBooks=action.payload;
        },
        [viewfile.rejected]:(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        },
        [deletefile.pending]:(state)=>{
            state.isLoading=true;
        },
        [deletefile.fulfilled]:(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.message=action.payload;
        },
        [deletefile.rejected]:(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        },
        [updatefile.pending]:(state)=>{
            state.isLoading=true;
        },
        [updatefile.fulfilled]:(state,action)=>{
            state.isLoading=false;
            state.isSuccess=true;
            state.message=action.payload;
        },
        [updatefile.rejected]:(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload;
        }
    }
})

export const {reset, setOldBook} = fileSlice.actions
export default fileSlice.reducer
