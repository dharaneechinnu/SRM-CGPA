import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  Button,
  Heading,
  Divider,
  ChakraProvider,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons'; // Import Icon from Chakra UI
import { FaUserCircle } from 'react-icons/fa'; // Import a user icon from react-icons
import StudentDashboard from '../Pages/Dashboard';
import Home from '../Pages/Home';
import LeaveRequest from '../../Pages/LeaveRequest';
import TeacherApprove from '../Pages/TeacherApprove';

const LeftNav = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('home'); // State to manage displayed content
  const [teacherInfo, setTeacherInfo] = useState({ name: '', email: '' }); // State to hold teacher details

  // Fetch teacher data from localStorage on component mount
  useEffect(() => {
    const storedTeacher = JSON.parse(localStorage.getItem('teacher'));
    if (storedTeacher && storedTeacher.user) {
      setTeacherInfo({
        name: storedTeacher.user.name || 'No Name',
        email: storedTeacher.user.email || 'No Email',
      });
    }

    const isLoggedIn = Boolean(storedTeacher);
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleNavClick = (page) => {
    setContent(page);
  };

  return (
    <ChakraProvider>
      <Flex height="100vh" bg="gray.50">
        {/* Sidebar */}
        <Flex
          as="nav"
          direction="column"
          alignItems="center"
          bg="white"
          width="250px"
          height="100%"
          py={6}
          px={4}
          boxShadow="md"
        >
          {/* Logo */}
          <Heading as="h1" size="md" mb={4}>
            CGPA
          </Heading>

          {/* Profile Icon */}
          <Icon as={FaUserCircle} boxSize="100px" mb={4} color="gray.500" />

          <VStack spacing={1} textAlign="center" mb={8}>
            <Text fontSize="lg" fontWeight="bold">
              {teacherInfo.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {teacherInfo.email}
            </Text>
          </VStack>

          {/* Navigation Links */}
          <VStack spacing={4} width="100%">
            <Button
              width="100%"
              variant="ghost"
              colorScheme={content === '0' ? 'blue' : 'gray'}
              onClick={() => handleNavClick('0')}
            >
              Home
            </Button>

            <Button
              width="100%"
              variant="ghost"
              colorScheme={content === '1' ? 'blue' : 'gray'}
              onClick={() => handleNavClick('1')}
            >
              Student
            </Button>

            <Button
              width="100%"
              variant="ghost"
              colorScheme={content === '2' ? 'blue' : 'gray'}
              onClick={() => handleNavClick('2')}
            >
              Leave request
            </Button>
          </VStack>

          <Divider my={6} />

          {/* Optional Logout Button */}
          <Button
            width="100%"
            colorScheme="red"
            variant="outline"
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
          >
            Logout
          </Button>
        </Flex>

        {/* Main Content */}
        <Box flex="1" p={8}>
          {content === '0' && <Home />}
          {content === '1' && <StudentDashboard />}
          {content === '2' && <TeacherApprove />}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default LeftNav;
