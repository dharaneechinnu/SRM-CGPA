import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import "@fontsource/poppins";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sidebarRef = useRef();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('CGPA-User'); // Remove user info from local storage
    navigate('/Login'); // Redirect to the login page
  };

  return (
    <Container scrolled={scrolled}>
      <Sidebar ref={sidebarRef} isOpen={isOpen}>
        <SidebarContent>
          <SidebarTitle>CGPA</SidebarTitle>
          <StyledLink to="/" onClick={toggleSidebar}>Home</StyledLink>
          <StyledLink to="/target" onClick={toggleSidebar}>Target</StyledLink>
          <StyledLink to="/analysis" onClick={toggleSidebar}>Analysis</StyledLink>
          <StyledLink to="/Login" onClick={handleLogout}>Logout</StyledLink>
        </SidebarContent>
      </Sidebar>
      
      <MainContent>
        <NavSection>
          <Logo>
            <h2><span>CGPA</span></h2>
          </Logo>
          <NavLinks>
            <StyledLink to="/">Home</StyledLink>
            <StyledLink to="/target">Target</StyledLink>
            <StyledLink to="/analysis">Analysis</StyledLink>
            <StyledLink to="/Login" onClick={handleLogout}>Logout</StyledLink>
          </NavLinks>
        </NavSection>
        <ToggleButton onClick={toggleSidebar}>
          {isOpen ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
              <path d="m0.75 23.249 22.5 -22.5" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
              <path d="M23.25 23.249 0.75 0.749" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
              <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M0.75 18.8999h7.3" stroke-width="1.5"></path>
              <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M0.75 12h14.8" stroke-width="1.5"></path>
              <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M0.75 5.1001h22.5" stroke-width="1.5"></path>
            </svg>
          )}
        </ToggleButton>
      </MainContent>

      {isOpen && <Backdrop onClick={toggleSidebar} />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  opacity: 0.95;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-250px)')};
  transition: transform 0.3s ease-in-out;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  @media screen and (min-width: 769px) {
    transform: translateX(0);
    position: static;
    width: 250px;
  }
`;

const SidebarTitle = styled.h1`
  font-family: poppins;
  font-size: 24px;
  color: black;
  margin: 20px;
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  gap: 20px;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and (max-width: 768px) {
    margin-left: 0;
  }
`;

const NavSection = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 30px;
`;

const Logo = styled.h1`
  color: black;
  margin: 0;
  margin-left: 20px;

  h2 {
    font-family: poppins;
    font-weight: 400;
  }

  @media screen and (max-width: 768px) {
    font-size: 24px;
  }

  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-left: auto;
  margin-right: 40px;
  margin-top: 12px;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
  font-size: 1rem;
  font-family: poppins;

  &:hover {
    color: #1EAAF1;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: black;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 30px;

  @media screen and (min-width: 769px) {
    display: none;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export default Nav;
