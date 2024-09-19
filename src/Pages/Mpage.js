import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Home from './Home';
import CalCpga from './CalCpga';
import Target from './Target';


const Mpage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('home'); // State to manage displayed content

  useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem('CGPA-User'));

    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleNavClick = (page) => {
    setContent(page);
  };

  return (
    <Container>
      <Nav>
        <NavTitle>CGPA</NavTitle>
        <NavLink onClick={() => handleNavClick('0')}>Home</NavLink>
        <NavLink onClick={() => handleNavClick('1')}>Calculated CGPA</NavLink>
        <NavLink onClick={() => handleNavClick('2')}>Target</NavLink>
        <NavLink onClick={() => handleNavClick('3')}>Leave Apply</NavLink>
        <NavLink onClick={() => handleNavClick('4')}>Certificated</NavLink>
        <NavLink onClick={() => handleNavClick('5')}>Resumes</NavLink>
        
      </Nav>
      <ContentContainer>
       {content === "0" && <Home/>}
       {content === "1" && <CalCpga/>}
       {content === "2" && <Target/>}
      </ContentContainer>
    </Container>
  );
};

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

export default Mpage;
