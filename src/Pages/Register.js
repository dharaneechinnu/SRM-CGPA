import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    curr_semester: '',
    gender: ''
  });
  const navigator = useNavigate();
  const [otp, setOtp] = useState(Array(4).fill('')); // Adjusted to 4 digits
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(30); // Countdown timer in seconds
  const [timerActive, setTimerActive] = useState(false);
  
  // Handles countdown and calls handleGenerateOtp
  useEffect(() => {
    let countdown;
    if (timerActive && timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      handleGenerateOtp(); // Generate OTP when timer runs out
      setTimer(30); // Reset timer to 30 seconds for the next cycle
    }
    return () => clearInterval(countdown);
  }, [timer, timerActive]);

  // Resets the timer and starts it
  const startTimer = () => {
    setTimer(30); // Reset timer to 30 seconds
    setTimerActive(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      if (!validateEmail(formData.email)) {
        setError("Please enter a valid SRM email address ending with @srmist.edu.in");
        return;
      }
  
      setError('');
  
      // Send form data to the API
      const response = await Api.post('/Auth/register', {
        email: formData.email,
        name: formData.name,
        dob: formData.dob,
        password: formData.password,
        curr_semester: formData.curr_semester,
        gender: formData.gender
      });
  
      if (response.status === 200) {
        setOtpSent(true);
        setSuccess('Registration successful! An OTP has been sent to your email. Please enter the OTP to verify your email.');
        console.log('Registration successful:', response.data);

        // Generate OTP immediately after successful registration
        handleGenerateOtp();

        // Start the countdown timer
        startTimer();
       
      } else {
        setError(response.data.message || 'An error occurred during registration');
      }
  
    } catch (error) {
      console.error("Error during form submission:", error.response ? error.response.data : error.message);
      setError('An error occurred during registration');
    }
  };

  const handleGenerateOtp = async () => {
    try {
      await Api.post('/Auth/generate-otp', { email: formData.email });
      alert("OTP sent");
    } catch (error) {
      console.error("Error generating OTP:", error);
      setError('An error occurred while generating OTP');
    }
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) { // Allow only single digit input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (value.length === 1 && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    console.log(formData);
    try {
      const response = await Api.post('/Auth/verify-otp', { email: formData.email, otp: otpCode });

      if (response.status === 200) {
        setSuccess('Email verified successfully!');
        console.log('OTP verification successful:', response.data);
        navigator('/login');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }

    } catch (error) {
      console.error("Error during OTP verification:", error);
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
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
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
          <Input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <Select
            name="curr_semester"
            value={formData.curr_semester}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Current Semester</option>
            {[...Array(8)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                Semester {index + 1}
              </option>
            ))}
          </Select>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
          <Button type="submit">Register</Button>
          <p>Already register?<Link to="/login">login in</Link></p>
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
  background-color: #f0f2f5;
`;

const Form = styled.form`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

const Select = styled.select`
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

  &:disabled {
    background-color: #d6d6d6;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
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

export default Register;
