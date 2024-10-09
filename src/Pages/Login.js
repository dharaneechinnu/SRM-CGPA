import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const navigator = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post('/Auth/login', { 
        email: formData.email, 
        password: formData.password 
      });

      if (response.status === 200) {
        if (response.data.user.verified) {
          setSuccess('Login successful!');
          localStorage.setItem('CGPA-User', JSON.stringify(response.data));

          // Role-based navigation
          const role = response.data.user.role;
          if (role === 'admin') {
            navigator('/Adminpanel');
          } else if (role === 'user') {
            navigator('/UserPage');
          } else {
            navigator('/Main');
          }
        } else {
          setShowOtpForm(true);
          setSuccess('Your email is not verified. Please enter the OTP sent to your email.');
          await handleGenerateOtp();
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login');
    }
  };

  const handleGenerateOtp = async () => {
    try {
      await Api.post('/Auth/generate-otp', { email: formData.email });
      alert('OTP sent');
      startTimer();
    } catch (error) {
      console.error('Error generating OTP:', error);
      setError('An error occurred while generating OTP');
    }
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value.length === 1 && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    try {
      const response = await Api.post('/Auth/verify-otp', { email: formData.email, otp: otpCode });

      if (response.status === 200) {
        setSuccess('Email verified successfully!');
        navigator('/Main');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      setError('An error occurred during OTP verification');
    }
  };

  const startTimer = () => {
    setTimer(30);
    setTimerActive(true);
  };

  useEffect(() => {
    let countdown;
    if (timerActive && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      handleGenerateOtp();
      setTimer(30);
    }
    return () => clearInterval(countdown);
  }, [timer, timerActive]);

  return (
    <FormContainer>
      {!showOtpForm ? (
        <Form onSubmit={handleSubmit}>
          <Title>Login</Title>
          {error && <Error>{error}</Error>}
          {success && <Success>{success}</Success>}
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit">Login</Button>
          <Linker>
            <Link to="/Forgot-Password">Forgot Password</Link>
            <Link to="/Register">Register</Link>
            <Link to="/Admin-login">Admin</Link>
            <Link to="/TeacherLogin">Teacher</Link>
          </Linker>
        </Form>
      ) : (
        <OtpForm onSubmit={handleOtpSubmit}>
          <Title>Verify OTP</Title>
          {error && <Error>{error}</Error>}
          {success && <Success>{success}</Success>}
          <OtpContainer>
            {otp.map((value, index) => (
              <OtpInput
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleOtpChange(e, index)}
                required
              />
            ))}
          </OtpContainer>
          <Button type="submit">Verify OTP</Button>
          <Timer>
            {timerActive ? `Resend OTP in ${timer} seconds` : 'You can resend OTP now.'}
          </Timer>
          <Button type="button" onClick={startTimer} disabled={timerActive}>
            Resend OTP
          </Button>
        </OtpForm>
      )}
    </FormContainer>
  );
};

// Styled components
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: white;
`;

const Form = styled.form`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
  width: 100%;
  max-width: 400px;
`;

const OtpForm = styled(Form)``;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
`;

const Linker = styled.p`
  display: flex;
  gap: 1rem;
`;

const Success = styled.p`
  color: green;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 20px 0;
`;

const OtpInput = styled.input`
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Timer = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 10px;
`;

export default Login;