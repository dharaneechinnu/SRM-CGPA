import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api'; 
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    Reg: '',
    password: '',
    dob: '',
    current_sem: '',
    year: '',
    section: '',
    gender: ''
  });

  const navigator = useNavigate();
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let countdown;
    if (timerActive && timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      setTimerActive(false); // Don't automatically resend OTP
    }
    return () => clearInterval(countdown);
  }, [timer, timerActive]);

  const startTimer = () => {
    setTimer(30);
    setTimerActive(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'current_sem' || name === 'year' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid SRM email address ending with @srmist.edu.in");
        return;
      }
  
      setError('');
  
      const response = await Api.post('/Auth/register', formData);
  
      if (response.status === 200) {
        setOtpSent(true);
        setSuccess('Registration successful! An OTP has been sent to your email. Please enter the OTP to verify your email.');
        handleGenerateOtp();
        startTimer();
      } else {
        setError(response.data.message || 'An error occurred during registration');
      }
  
    } catch (error) {
      setError('An error occurred during registration');
    }
  };

  const handleGenerateOtp = async () => {
    try {
      await Api.post('/Auth/generate-otp', { email: formData.email });
      alert("OTP sent");
    } catch (error) {
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
        navigator('/login');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }

    } catch (error) {
      setError('An error occurred during OTP verification');
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@srmist\.edu\.in$/;
    return regex.test(email);
  };

  return (
    <FormContainer>
      {!otpSent ? (
        <Form onSubmit={handleSubmit}>
          <Title>Register</Title>
          {error && <Error>{error}</Error>}
          {success && <Success>{success}</Success>}
          <Input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <Input type="text" name="Reg" placeholder="Registration Number" value={formData.Reg} onChange={handleChange} required />
          <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <Input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          <Select name="current_sem" value={formData.current_sem || ''} onChange={handleChange} required>
            <option value="" disabled>Select Current Semester</option>
            {[...Array(8)].map((_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </Select>
          <Select name="year" value={formData.year || ''} onChange={handleChange} required>
            <option value="" disabled>Select Year</option>
            {[...Array(4)].map((_, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}</option>
            ))}
          </Select>
          <Select name="section" value={formData.section} onChange={handleChange} required>
            <option value="" disabled>Select Section</option>
            {[...Array(26)].map((_, index) => (
              <option key={String.fromCharCode(65 + index)} value={String.fromCharCode(65 + index)}>
                {String.fromCharCode(65 + index)}
              </option>
            ))}
          </Select>
          <Select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
          <Button type="submit">Register</Button>
          <p>Already registered? <Link to="/login">Login here</Link></p>
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
            {timerActive ? `Resend OTP in ${timer} seconds` : "You can resend OTP now."}
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
  color: black;
  padding: 0 10px;
`;

const Form = styled.form`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 20px;
  box-sizing: border-box;
`;

const OtpForm = styled(Form)``;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const OtpInput = styled(Input)`
  width: 50px;
  text-align: center;
`;

const Error = styled.p`
  color: red;
  text-align: center;
`;

const Success = styled.p`
  color: green;
  text-align: center;
`;

const Timer = styled.p`
  text-align: center;
`;

export default Register;
