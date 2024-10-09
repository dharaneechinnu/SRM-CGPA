import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  Input,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Avatar,
  useToast,
  Spinner,
  ChakraProvider,
  VStack,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api/Api';
import male from '../Assest/male.jpg';
import female from '../Assest/female.jpg';

const Home = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  const userid = localStorage.getItem("CGPA-User");
  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await Api.get(`/api/student/${reg}`);
        if (response.status === 200) {
          setStudent(response.data);
          setFormData(response.data);
        } else {
          console.error('Failed to fetch student details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    if (reg) {
      fetchStudentDetails();
    }
  }, [reg]);

  

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await Api.put(`/api/student/${reg}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setStudent(formData);
        setIsEditing(false);
        toast({
          title: 'Changes saved successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Failed to save changes:', response.status);
        toast({
          title: 'Failed to save changes',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: 'Error saving changes',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!student) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const formattedDOB = new Date(student.dob).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const genderImage = student.gender === 'male' ? male : female;

  return (
    <ChakraProvider>
      <Box p={{ base: 4, md: 8 }} maxW="7xl" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="lg">
        <Flex justify="space-between" align="center" mb={6}>
          <Button colorScheme="green" onClick={handleEdit}>
            Edit
          </Button>
         
        </Flex>

        <Heading as="h1" size="2xl" textAlign="center" my={6} color="blue.600">
          Student Dashboard
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} p={5} bg="white" borderRadius="lg" boxShadow="base">
          <VStack spacing={6}>
            <Avatar size="2xl" src={genderImage} />
            <Text fontSize="2xl" fontWeight="bold" color="gray.700">
              {student.name}
            </Text>
            <Text fontSize="lg" color="gray.500">
              Registration Number: {student.Reg}
            </Text>
            <Text fontSize="lg" color="gray.500">
              Date of Birth: {formattedDOB}
            </Text>
          </VStack>

          <VStack spacing={4} align="start">
            <FormControl>
              <FormLabel fontWeight="bold">Current Semester</FormLabel>
              <Input
                name="current_sem"
                value={formData.current_sem || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Mobile No</FormLabel>
              <Input
                name="mobileNo"
                value={formData.mobileNo || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Address</FormLabel>
              <Input
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Parent Address</FormLabel>
              <Input
                name="parentAddress"
                value={formData.parentAddress || ''}
                onChange={handleInputChange}
                isDisabled={!isEditing}
              />
            </FormControl>

            {isEditing && (
              <Button colorScheme="blue" onClick={handleSaveChanges} mt={4} width="full">
                Save Changes
              </Button>
            )}
          </VStack>
        </SimpleGrid>

        <Divider my={8} />

        <Box bg="white" p={5} borderRadius="lg" boxShadow="base">
          <Heading as="h2" size="lg" mb={6} color="blue.600">
            Academic Information
          </Heading>
          <Stack spacing={4}>
            <Text fontSize="lg">
              <strong>Current Semester:</strong> {student.current_sem}
            </Text>
            <Text fontSize="lg">
              <strong>CGPA:</strong> {student.cgpa.toFixed(2)}
            </Text>
            <Text fontSize="lg">
              <strong>Required CGPA:</strong> {student.targetCgpa || 'N/A'}
            </Text>
          </Stack>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Home;
