import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  VStack,
  Avatar,
  useColorModeValue,
  IconButton,
  Collapse,
  useDisclosure,
  ChakraProvider,
} from '@chakra-ui/react';
import { FaHome, FaCalculator, FaBullseye, FaTasks, FaCertificate, FaFileAlt, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import CalCpga from './CalCpga';
import Target from './Target';
import Tracker from './Tracker';
import CertificateUpload from './CertificateUpload';
import ResumeUpload from './ResumeUpload';

const Mpage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('home');
  const [showWelcome, setShowWelcome] = useState(true);
  const { isOpen, onToggle } = useDisclosure(); // For collapsible sidebar
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem('CGPA-User'));
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleNavClick = (page) => {
    setContent(page);
    setShowWelcome(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('CGPA-User'); // Clear user session
    navigate('/'); // Redirect to login page
  };

  return (
    <ChakraProvider>
      <Flex height="100vh" overflow="hidden">
        {/* Sidebar */}
        <Box
          w={{ base: isOpen ? '200px' : '70px', md: '250px' }}
          bg={bgColor}
          borderRight="1px solid"
          borderColor={borderColor}
          p={5}
          transition="width 0.3s ease"
          display="flex"
          flexDirection="column"
          alignItems={isOpen ? 'flex-start' : 'center'}
        >
          {/* Toggle Sidebar Button */}
          <IconButton
            icon={<FaBars />}
            onClick={onToggle}
            mb={5}
            variant="ghost"
            color={textColor}
            aria-label="Toggle Sidebar"
          />
          <Collapse in={isOpen} animateOpacity>
            <Heading size="lg" mb={8} color={textColor}>
              CGPA Portal
            </Heading>
          </Collapse>

          {/* Navigation Links */}
          <VStack
            alignItems={isOpen ? 'flex-start' : 'center'}
            spacing={4}
            w="full"
          >
            <Button
              leftIcon={isOpen ? <FaHome /> : null}
              iconSpacing={isOpen ? 2 : 0}
              onClick={() => handleNavClick('0')}
              colorScheme="teal"
              justifyContent={isOpen ? 'flex-start' : 'center'}
              variant="ghost"
              w="full"
              py={6}
            >
              {isOpen ? 'Home' : <FaHome />}
            </Button>

            <Button
              leftIcon={isOpen ? <FaCalculator /> : null}
              iconSpacing={isOpen ? 2 : 0}
              onClick={() => handleNavClick('1')}
              colorScheme="teal"
              justifyContent={isOpen ? 'flex-start' : 'center'}
              variant="ghost"
              w="full"
              py={6}
            >
              {isOpen ? 'Calculate CGPA' : <FaCalculator />}
            </Button>

            <Button
              leftIcon={isOpen ? <FaBullseye /> : null}
              iconSpacing={isOpen ? 2 : 0}
              onClick={() => handleNavClick('2')}
              colorScheme="teal"
              justifyContent={isOpen ? 'flex-start' : 'center'}
              variant="ghost"
              w="full"
              py={6}
            >
              {isOpen ? 'Target' : <FaBullseye />}
            </Button>

            <Button
              leftIcon={isOpen ? <FaTasks /> : null}
              iconSpacing={isOpen ? 2 : 0}
              onClick={() => handleNavClick('3')}
              colorScheme="teal"
              justifyContent={isOpen ? 'flex-start' : 'center'}
              variant="ghost"
              w="full"
              py={6}
            >
              {isOpen ? 'Tracker' : <FaTasks />}
            </Button>

            <Button
              leftIcon={isOpen ? <FaCertificate /> : null}
              iconSpacing={isOpen ? 2 : 0}
              onClick={() => handleNavClick('4')}
              colorScheme="teal"
              justifyContent={isOpen ? 'flex-start' : 'center'}
              variant="ghost"
              w="full"
              py={6}
            >
              {isOpen ? 'Certificates' : <FaCertificate />}
            </Button>

            <Button
              leftIcon={isOpen ? <FaFileAlt /> : null}
              iconSpacing={isOpen ? 2 : 0}
              onClick={() => handleNavClick('5')}
              colorScheme="teal"
              justifyContent={isOpen ? 'flex-start' : 'center'}
              variant="ghost"
              w="full"
              py={6}
            >
              {isOpen ? 'Resumes' : <FaFileAlt />}
            </Button>
          </VStack>

          {/* Logout Button */}
          <Button
            leftIcon={isOpen ? <FaSignOutAlt /> : null}
            iconSpacing={isOpen ? 2 : 0}
            onClick={handleLogout}
            colorScheme="red"
            justifyContent={isOpen ? 'flex-start' : 'center'}
            variant="ghost"
            w="full"
            mt={8}
            py={6}
          >
            {isOpen ? 'Logout' : <FaSignOutAlt />}
          </Button>
        </Box>

        {/* Main Content */}
        <Box flex="1" p={5} overflowY="auto" bg={useColorModeValue('gray.100', 'gray.900')}>
          {showWelcome && (
            <Box textAlign="center" my={10}>
              <Heading size="2xl" color={textColor}>Welcome to the CGPA Portal!</Heading>
              <Text fontSize="lg" mt={3} color={textColor}>
                Your gateway to academic success.
              </Text>
            </Box>
          )}
          {content === '0' && <Home />}
          {content === '1' && <CalCpga />}
          {content === '2' && <Target />}
          {content === '3' && <Tracker />}
          {content === '4' && <CertificateUpload />}
          {content === '5' && <ResumeUpload />}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Mpage;
