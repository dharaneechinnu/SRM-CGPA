import React, { useState, useEffect } from 'react';
import { json, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  useColorModeValue,
  VStack,
  HStack,
  Avatar,
  AvatarBadge,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ChakraProvider,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiLogOut } from 'react-icons/fi';
import Api from '../../Api/Api'; // Assuming you have an Api.js file for making API requests

const Home = () => {
  const [students, setStudents] = useState([]); // Initial value as an empty array
  const [topStudents, setTopStudents] = useState([]); // Initial value as an empty array
  const [averageCGPA, setAverageCGPA] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const totalStudents = students?.length || 0; // Default to 0 if students is undefined
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const teacher = JSON.parse(localStorage.getItem("teacher"))
  const year = teacher?.user?.year;
  const section =  teacher?.user?.section;
console.log(year ,section)
  // Fetch data when the component mounts
  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const response = await Api.post('/teacher/totalstudents', { year,section });
        if (response.data.students) {
          setStudents(response.data.students);
        }
      } catch (error) {
        console.log('Error fetching total students:', error);
      }
    };

    const fetchTopStudents = async () => {
      try {
        const response = await Api.post('/teacher/topcgpa', { year: 3, section: 'A' });
        if (response.data.topStudents) {
          setTopStudents(response.data.topStudents);
        }
      } catch (error) {
        console.log('Error fetching top students:', error);
      }
    };

    const fetchClassCGPAAnalysis = async () => {
      try {
        const response = await Api.post('/teacher/classcgpa', { year: 3, section: 'A' });
        if (response.data.students) {
          setStudents(response.data.students);
        }
        if (response.data.averageCGPA) {
          setAverageCGPA(response.data.averageCGPA);
        }
      } catch (error) {
        console.log('Error fetching CGPA analysis:', error);
      }
    };

    fetchTotalStudents();
    fetchTopStudents();
    fetchClassCGPAAnalysis();
  }, []);

  const graphData = students?.map((student) => ({
    name: student?.name || 'Unknown',
    cgpa: student?.cgpa || 0,
  }));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')} p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Heading as="h1" size="xl" color={textColor}>
            Teacher Dashboard
          </Heading>
          <Button leftIcon={<FiLogOut />} colorScheme="red" variant="solid" onClick={onOpen}>
            Logout
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={borderColor}
            rounded={'lg'}
            bg={bgColor}
          >
            <StatLabel fontWeight={'medium'} isTruncated>
              Total Students
            </StatLabel>
            <StatNumber fontSize={'4xl'} fontWeight={'medium'}>
              {totalStudents}
            </StatNumber>
          </Stat>

          <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={borderColor}
            rounded={'lg'}
            bg={bgColor}
          >
            <StatLabel fontWeight={'medium'} isTruncated>
              Top CGPA Student
            </StatLabel>
            {topStudents[0] && (
              <HStack spacing={3}>
                <Avatar size="md" name={topStudents[0]?.name || 'Unknown'}>
                  <AvatarBadge boxSize="1em" bg="green.500" />
                </Avatar>
                <VStack alignItems="flex-start" spacing={0}>
                  <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                    {topStudents[0]?.name || 'Unknown'}
                  </StatNumber>
                  <StatHelpText>
                    <Badge colorScheme="blue">{topStudents[0]?.cgpa || 0} CGPA</Badge>
                  </StatHelpText>
                </VStack>
              </HStack>
            )}
          </Stat>

          <Stat
            px={{ base: 2, md: 4 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={borderColor}
            rounded={'lg'}
            bg={bgColor}
          >
            <StatLabel fontWeight={'medium'} isTruncated mb={2}>
              Top 3 Students
            </StatLabel>
            <VStack alignItems="stretch" spacing={2}>
              {topStudents.slice(1, 4).map((student, index) => (
                <HStack key={index} justifyContent="space-between">
                  <Text fontWeight="medium">{student?.name || 'Unknown'}</Text>
                  <Badge colorScheme="green">{student?.cgpa || 0}</Badge>
                </HStack>
              ))}
            </VStack>
          </Stat>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box
            bg={bgColor}
            p={6}
            rounded={'lg'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={borderColor}
          >
            <Heading as="h3" size="md" mb={4}>
              CGPA Analysis of the Class
            </Heading>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="cgpa" fill="#4299E1" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Text mt={4}>Average CGPA: {averageCGPA}</Text>
          </Box>

          <Box
            bg={bgColor}
            p={6}
            rounded={'lg'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={borderColor}
          >
            <Heading as="h3" size="md" mb={4}>
              Academic Calendar
            </Heading>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date }) => {
                if (date.getDay() === 0 || date.getDay() === 6) {
                  return 'weekend';
                }
              }}
            />
          </Box>
        </SimpleGrid>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Logout</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Are you sure you want to log out?</ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Confirm Logout
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
