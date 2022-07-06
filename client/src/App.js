import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from './component/header'
import Home from './features/Home/home'
import Login from './features/auth/login'
import Register from './features/auth/register'
import UploadFile from './features/files/UploadFile';
import ViewBooks from './features/files/ViewBooks';
import UpdateFile from './features/files/updateFile';
import ChangePass from './features/auth/changePass';
import ForgotPass from './features/auth/forgotPass';
import RecoverPass from './features/auth/recoverPass';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/upload' element={<UploadFile/>}></Route>
          <Route path='/viewbooks' element={<ViewBooks/>}></Route>
          <Route path='/updateFile' element={<UpdateFile/>}></Route>
          <Route path='/changepass' element={<ChangePass/>}></Route>
          <Route path='/forgotpass' element={<ForgotPass/>}></Route>
          <Route path='/recover/:token' element={<RecoverPass/>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
