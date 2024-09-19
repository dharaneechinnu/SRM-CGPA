import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    Reg:'',
    password: '',
    dob: '',
    current_sem: '', // This will be updated as a number
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

    // Ensure current_sem is stored as a number, and other inputs are treated as strings
    setFormData({
      ...formData,
      [name]: name === 'current_sem' ? parseInt(value) : value,
    });

    console.log('Updated Form Data:', formData); // Debug state updates
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
        Reg: formData.Reg,
        name: formData.name,
        dob: formData.dob,
        password: formData.password,
        current_sem: formData.current_sem,
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
  type="text"
  name="Reg" // Corrected name attribute
  placeholder="Enter your Registration Number"
  value={formData.Reg}
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
            name="current_sem"
            value={formData.current_sem || ''}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Current Semester</option>
            {[...Array(8)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
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
  padding: 0 10px; // Added padding to prevent content from touching edges
`;

const Form = styled.form`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px; // Increased max-width for better visibility on larger screens
  margin: 20px;
  box-sizing: border-box; // Ensures padding and border are included in the element's total width and height
`;

const OtpForm = styled(Form)``;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 1.5rem; // Adjusted font size for better scalability
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem; // Adjusted font size
  box-sizing: border-box; // Ensures padding and border are included in the element's total width and height
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem; // Adjusted font size
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem; // Adjusted font size
  cursor: pointer;
  margin-top: 10px; // Added margin for spacing

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px; // Added margin for spacing
`;

const OtpInput = styled(Input)`
  width: 50px;
  text-align: center;
`;

const Error = styled.p`
  color: red;
  text-align: center; // Centered text
`;

const Success = styled.p`
  color: green;
  text-align: center; // Centered text
`;

const Timer = styled.p`
  text-align: center;
  margin-top: 15px;
  font-size: 0.875rem; // Adjusted font size
`;

export default Register;
