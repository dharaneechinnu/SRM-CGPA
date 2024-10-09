import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Home = () => {
  const [students, setStudents] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const totalStudents = students.length;
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const dummyStudents = [
      { name: 'John Doe', cgpa: 9.8 },
      { name: 'Jane Smith', cgpa: 9.6 },
      { name: 'Michael Scott', cgpa: 9.5 },
      { name: 'Pam Beesly', cgpa: 9.3 },
      { name: 'Dwight Schrute', cgpa: 9.1 },
    ];
    setStudents(dummyStudents);
    setTopStudents(dummyStudents.sort((a, b) => b.cgpa - a.cgpa).slice(0, 5));
  }, []);

  const graphData = students.map(student => ({
    name: student.name,
    cgpa: student.cgpa,
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
              <Avatar size="md" name={topStudents[0].name}>
                <AvatarBadge boxSize="1em" bg="green.500" />
              </Avatar>
              <VStack alignItems="flex-start" spacing={0}>
                <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                  {topStudents[0].name}
                </StatNumber>
                <StatHelpText>
                  <Badge colorScheme="blue">{topStudents[0].cgpa} CGPA</Badge>
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
                <Text fontWeight="medium">{student.name}</Text>
                <Badge colorScheme="green">{student.cgpa}</Badge>
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
          <ModalBody>
            Are you sure you want to log out?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="ghost" onClick={handleLogout}>Confirm Logout</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
</ChakraProvider>
  );
};

export default Home;