import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  background-color: black;
  transition: background-color 0.3s ease;
  padding: 20px;
`;

const Slogan = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.text};
  text-align: center;
  margin-bottom: 40px;

  @media (min-width: 768px) {
    font-size: 3rem;  // Larger font size for tablets and desktops
  }

  @media (min-width: 1024px) {
    font-size: 4rem;  // Even larger for bigger screens
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const OptionButton = styled.button`
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
  background-color: white;

  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.buttonHoverBackground};
  }

  @media (max-width: 600px) {
    font-size: 1rem;  // Smaller buttons for mobile devices
    padding: 10px 20px;
  }
`;

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('CGPA-User');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate('/Login');
  };

  const handleCGPACalculator = () => {
    navigate('/cgpa');
  };

  return (
    <WelcomeContainer>
      <Slogan>Simplify Your Success,<br />One CGPA at a Time.</Slogan>
      <ButtonContainer>
        <OptionButton onClick={handleLogin}>Login</OptionButton>
        <OptionButton onClick={handleCGPACalculator}>CGPA Calculator</OptionButton>
      </ButtonContainer>
    </WelcomeContainer>
  );
};

export default Welcome;
