import React, { useState } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api'; // Adjust the path according to your project structure
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(4).fill('')); // Adjust length based on OTP format
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request', 'verify'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigator = useNavigate()
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (value.length === 1 && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post('/Auth/reset-password', { email });
      if (response.status === 200) {
        setSuccess('Password reset code has been sent to your email.');
        setStep('verify');
      } else {
        setError(response.data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      console.error('Error during password reset request:', error);
      setError('An error occurred while sending the reset link.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await Api.patch('/Auth/resetpass-otp', {  token: otpCode, pwd: newPassword });
      if (response.status === 200) {
        setSuccess('Password reset successfully!');
        navigator('/login')
        setStep('request'); // Go back to initial state
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.data?.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error during OTP verification and password reset:', error);
      setError(error.response?.data?.message || 'An error occurred during OTP verification and password reset');
    }
  };

  return (
    <FormContainer>
      {step === 'request' && (
        <Form onSubmit={handleRequestSubmit}>
          <Title>Forgot Password</Title>
          {error && <Error>{error}</Error>}
          {success && <Success>{success}</Success>}
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
          <Button type="submit">Send Reset Code</Button>
        </Form>
      )}

      {step === 'verify' && (
        <Form onSubmit={handleOtpSubmit}>
          <Title>Reset Password</Title>
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
          <Input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="New Password"
            required
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm New Password"
            required
          />
          <Button type="submit">Reset Password</Button>
        </Form>
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

export default ForgotPassword;
