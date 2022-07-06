import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authAPI from './authAPI';

const user = JSON.parse(localStorage.getItem('token'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    verifyToken:true
}

export const register = createAsyncThunk('auth/register',async (user, thunkAPI)=>{
    try{
        let response = await authAPI.register(user);
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

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        let response =  await authAPI.login(user);
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response
        }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const ChangePassword = createAsyncThunk('auth/ChangePassword', async (user, thunkAPI) => {
    try {
        let response =  await authAPI.ChangePassword(user);
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response
        }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const ForgotPassword = createAsyncThunk('auth/ForgotPassword', async (user, thunkAPI) => {
    try {
        let response =  await authAPI.ForgotPassword(user);
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response
        }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const checkRecoverToken = createAsyncThunk('auth/checkRecoverToken', async (token, thunkAPI) => {
    try {
        let response =  await authAPI.checkRecoverToken(token);
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response
        }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const RecoverPassword = createAsyncThunk('auth/RecoverPassword', async (user, thunkAPI) => {
    try {
        let response =  await authAPI.RecoverPassword(user);
        if(response.error){
            return thunkAPI.rejectWithValue(response.error)
        }else{
            return response
        }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async () => {
    await authAPI.logout()
})

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading=false
            state.isSuccess=false
            state.isError=false
            state.message=''
            state.verifyToken=true
        },
        loaduser:(state)=>{
            state.user=JSON.parse(localStorage.getItem('token'));
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(register.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(register.fulfilled,(state,action)=>{
            state.isLoading=true
            state.isSuccess=true
            state.user = action.payload
        })
        .addCase(register.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
            state.user = null
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(logout.fulfilled, (state) => {
          state.user = null
        })
        .addCase(ChangePassword.pending, (state) => {
            state.isLoading = true
        })
        .addCase(ChangePassword.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload
        })
        .addCase(ChangePassword.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(ForgotPassword.pending, (state) => {
            state.isLoading = true
        })
        .addCase(ForgotPassword.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload
        })
        .addCase(ForgotPassword.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(checkRecoverToken.pending, (state) => {
            state.isLoading = true
        })
        .addCase(checkRecoverToken.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
        })
        .addCase(checkRecoverToken.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.verifyToken = false
            state.message = action.payload
        })
        .addCase(RecoverPassword.pending, (state) => {
            state.isLoading = true
        })
        .addCase(RecoverPassword.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload
        })
        .addCase(RecoverPassword.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset, loaduser} = authSlice.actions
export default authSlice.reducer
