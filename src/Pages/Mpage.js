import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Home from './Home';
import CalCpga from './CalCpga';
import Target from './Target';
import Tracker from './Tracker';
import CertificateUpload from './CertificateUpload';
import ResumeUpload from './ResumeUpload';

const Mpage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('home'); // State to manage displayed content
  const [showWelcome, setShowWelcome] = useState(true); // State to manage the welcome message

  useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem('CGPA-User'));

    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleNavClick = (page) => {
    setContent(page);
    setShowWelcome(false); // Hide welcome message when navigating
  };

  return (
    <Container>
      <Nav>
        <NavTitle>CGPA</NavTitle>
        <NavLink onClick={() => handleNavClick('0')}>Home</NavLink>
        <NavLink onClick={() => handleNavClick('1')}>Calculated CGPA</NavLink>
        <NavLink onClick={() => handleNavClick('2')}>Target</NavLink>
        <NavLink onClick={() => handleNavClick('3')}>Tracker</NavLink>
        <NavLink onClick={() => handleNavClick('4')}>Certificated</NavLink>
        <NavLink onClick={() => handleNavClick('5')}>Resumes</NavLink>
      </Nav>
      <ContentContainer>
        {showWelcome && (
          <WelcomeContainer>
            <WelcomeTitle>Welcome to the CGPA Portal!</WelcomeTitle>
            <WelcomeSlogan>Your gateway to academic success.</WelcomeSlogan>
          </WelcomeContainer>
        )}
        {content === "0" && <Home />}
        {content === "1" && <CalCpga />}
        {content === "2" && <Target />}
        {content === "3" && <Tracker />}
        {content === "4" && <CertificateUpload />}
        {content === "5" && <ResumeUpload />}
      </ContentContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 20px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
`;

const NavTitle = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  color: black;
  margin-bottom: 20px;
`;

const NavLink = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: black;
  margin: 10px 0;
  cursor: pointer;
  &:hover {
    color: #1EAAF1;
  }
`;

const ContentContainer = styled.div`
  margin-left: 250px; // Adjust based on your sidebar width
  padding: 20px;
  width: 100%;
`;

const WelcomeContainer = styled.div`
  text-align: center;
  margin: 20px;
`;

const WelcomeTitle = styled.h2`
  font-size: 28px;
  color: #007bff;
  margin-bottom: 10px;
`;

const WelcomeSlogan = styled.p`
  font-size: 18px;
  color: #555;
`;

export default Mpage;
  