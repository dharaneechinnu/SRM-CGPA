import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/Welcome';  // Ensure correct path and case sensitivity
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/ForgotPassword';
import Mpage from './Pages/Mpage';
import NotStoreCgpa from './Pages/NotStoreCgpa';
import AddTeacher from './Admin/AddTeacher';
import AdminLogin from './Admin/Login';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/cgpa" element={<NotStoreCgpa />} />
        <Route path="/Login" element={<Login />} />
        <Route path= '/Register' element={<Register/>} />
       <Route path= '/Forgot-Password' element={<ForgotPassword/>} />
       <Route path= '/Main' element={<Mpage/>} />
       <Route path= '/Admin-login' element={<AdminLogin/>} />
       <Route path= '/Adminpanel' element={<AddTeacher/>} />
      
      </Routes>
    </BrowserRouter>
  );
};

export default App;
