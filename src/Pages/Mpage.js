import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  VStack,
  IconButton,
  useToast,
  useDisclosure,
  ChakraProvider,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaHome,
  FaCalculator,
  FaBullseye,
  FaTasks,
  FaCertificate,
  FaFileAlt,
  FaBars,
  FaSignOutAlt,
  FaEnvelopeOpenText,  // Importing the icon for Leave Request
} from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import framer-motion for animations
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import CalCpga from './CalCpga';
import Target from './Target';
import Tracker from './Tracker';
import CertificateUpload from './CertificateUpload';
import ResumeUpload from './ResumeUpload';
import  LeaveRequest from './LeaveRequest'; // Importing the Leave Request component

const Mpage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('home');
  const [showWelcome, setShowWelcome] = useState(true);
  const { isOpen, onToggle } = useDisclosure(); // For collapsible sidebar
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast(); // Use toast for showing messages

  useEffect(() => {
    const isLoggedIn = Boolean(localStorage.getItem('CGPA-User'));
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleNavClick = (page) => {
    setContent(page);
    setShowWelcome(false);
    toast({
      title: 'Navigation Success',
      description: `You have navigated to the ${page} section.`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('CGPA-User'); // Clear user session
    navigate('/'); // Redirect to login page
    toast({
      title: 'Logged Out',
      description: "You have successfully logged out.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider>
      <Flex height="100vh" overflow="hidden">
        {/* Sidebar */}
        <Box
          w={isOpen ? { base: '200px', md: '250px' } : { base: '70px', md: '70px' }}
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
          <motion.div // Motion wrapper for icon animation
            whileHover={{ scale: 1.2 }} // Icon grows on hover
            transition={{ duration: 0.3 }}
          >
            <IconButton
              icon={<FaBars size="1em" />} // Make the icon bigger
              onClick={onToggle}
              mb={9}
              variant="ghost"
              color={textColor}
              aria-label="Toggle Sidebar"
            />
          </motion.div>
          {isOpen && (
            <Heading size="lg" mb={8} color={textColor}>
              CGPA Portal
            </Heading>
          )}

          {/* Navigation Links */}
          <VStack
            alignItems={isOpen ? 'flex-start' : 'center'}
            spacing={4}
            w="full"
          >
            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <Button
                leftIcon={<FaHome size="1.5em" />} // Larger icon size
                onClick={() => handleNavClick('0')}
                colorScheme="teal"
                justifyContent={isOpen ? 'flex-start' : 'center'}
                variant="ghost"
                w="full"
                py={6}
              >
                {isOpen && 'Home'}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <Button
                leftIcon={<FaCalculator size="1.5em" />} // Larger icon size
                onClick={() => handleNavClick('1')}
                colorScheme="teal"
                justifyContent={isOpen ? 'flex-start' : 'center'}
                variant="ghost"
                w="full"
                py={6}
              >
                {isOpen && 'Calculate CGPA'}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <Button
                leftIcon={<FaBullseye size="1.5em" />} // Larger icon size
                onClick={() => handleNavClick('2')}
                colorScheme="teal"
                justifyContent={isOpen ? 'flex-start' : 'center'}
                variant="ghost"
                w="full"
                py={6}
              >
                {isOpen && 'Target'}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <Button
                leftIcon={<FaTasks size="1.5em" />} // Larger icon size
                onClick={() => handleNavClick('3')}
                colorScheme="teal"
                justifyContent={isOpen ? 'flex-start' : 'center'}
                variant="ghost"
                w="full"
                py={6}
              >
                {isOpen && 'Tracker'}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <Button
                leftIcon={<FaCertificate size="1.5em" />} // Larger icon size
                onClick={() => handleNavClick('4')}
                colorScheme="teal"
                justifyContent={isOpen ? 'flex-start' : 'center'}
                variant="ghost"
                w="full"
                py={6}
              >
                {isOpen && 'Certificates'}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <Button
                leftIcon={<FaFileAlt size="1.5em" />} // Larger icon size
                onClick={() => handleNavClick('5')}
                colorScheme="teal"
                justifyContent={isOpen ? 'flex-start' : 'center'}
                variant="ghost"
                w="full"
                py={6}
              >
                {isOpen && 'Resumes'}
              </Button>
            </motion.div>

            {/* Leave Request Button */}
            <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
              <Button
                leftIcon={<FaEnvelopeOpenText size="1.5em" />} // Larger icon size
                onClick={() => handleNavClick('6')} // Assume '6' is for Leave Request
                colorScheme="teal"
                justifyContent={isOpen ? 'flex-start' : 'center'}
                variant="ghost"
                w="full"
                py={6}
              >
                {isOpen && 'Leave Request'}
              </Button>
            </motion.div>
          </VStack>

          {/* Logout Button */}
          <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
            <Button
              leftIcon={<FaSignOutAlt size="1.5em" />} // Larger icon size
              onClick={handleLogout}
              colorScheme="red"
              justifyContent={isOpen ? 'flex-start' : 'center'}
              variant="ghost"
              w="full"
              mt={8}
              py={6}
            >
              {isOpen && 'Logout'}
            </Button>
          </motion.div>
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
          {content === '6' && <LeaveRequest/>  }
          </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Mpage;
