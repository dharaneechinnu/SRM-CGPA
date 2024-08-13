import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login';
import Register from './Pages/Register';
import Welcome from './Pages/Welcome'
import ForgotPassword from './Pages/ForgotPassword';

function App() {
  return (
   <>
      <Router>
    <Routes>
       <Route path='/' element={<Welcome/>} />
       <Route path='/Login' element={<Login/>} />
       <Route path= '/Register' element={<Register/>} />
       <Route path= '/Forgot-Password' element={<ForgotPassword/>} />
  
    </Routes>
  </Router>
   </>
  );
}

export default App;
