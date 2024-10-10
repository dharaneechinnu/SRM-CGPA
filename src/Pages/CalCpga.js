import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
  ChakraProvider,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import Api from '../Api/Api'; // Import your API module

// Grade to point mapping
const gradeToPoint = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5,
  F: 0,
};

const CalCpga = () => {
  const [courses, setCourses] = useState([{ credits: '', grade: '' }]);
  const [cgpa, setCgpa] = useState(null);
  const [semester, setSemester] = useState('');
  const [sgpa, setSgpa] = useState(null);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [sgpaRecords, setSgpaRecords] = useState([]); // State to store SGPA records
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Fetch the user ID and registration number from localStorage
  const userid = localStorage.getItem("CGPA-User");
  const parsedUser = JSON.parse(userid || '{}');
  const reg = parsedUser?.user?.Reg;

  // Fetch CGPA and SGPA records on component mount
  useEffect(() => {
    fetchCGPA();
    fetchSGPARecords(); // Fetch updated SGPA records
  }, [reg]);

  const fetchSGPARecords = async () => {
    try {
      const response = await Api.get(`/api/sgpa/${reg}`);
      if (response.status === 200) {
        setSgpaRecords(response.data.sgpas || []);
        console.log(response.data.sgpas); // Debugging: check the structure of the response
      } else {
        console.error('Failed to fetch SGPA records:', response.status);
      }
    } catch (error) {
      console.error('Error fetching SGPA records:', error);
    }
  };
  

  // Fetch CGPA
  const fetchCGPA = async () => {
    try {
      const response = await Api.get(`/api/cgpa/${reg}`);
      if (response.status === 200) {
        setCgpa(response.data.cgpa ? response.data.cgpa.toFixed(2) : null); // Set CGPA
      } else {
        console.error('Failed to fetch CGPA:', response.status);
      }
    } catch (error) {
      console.error('Error fetching CGPA:', error);
    }
  };

  // Handle adding new course input fields
  const handleAddCourse = () => {
    setCourses([...courses, { credits: '', grade: '' }]);
  };

  // Handle removing a course input field
  const handleRemoveCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  // Handle input changes
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedCourses = [...courses];
    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
  };

  // Handle SGPA calculation
  const calculateSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const credits = parseFloat(course.credits);
      const grade = gradeToPoint[course.grade]; // Convert grade to points using the mapping
      if (!isNaN(credits) && credits >= 0 && grade !== undefined) {
        totalPoints += credits * grade;
        totalCredits += credits;
      }
    });

    if (totalCredits > 0) {
      const sgpaResult = totalPoints / totalCredits;
      setSgpa(sgpaResult.toFixed(2)); // Display SGPA with 2 decimal places
      setIsConfirmVisible(true); // Show confirmation
    } else {
      setSgpa(null);
      toast({
        title: "Incomplete Information",
        description: "Please add credits and grades for all courses.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Save SGPA to backend after user confirmation
  const saveSGPA = async () => {
    try {
      const response = await Api.post('/api/sgpa', { semester, sgpa, reg });
      if (response.status === 200) {
        toast({
          title: "SGPA Saved",
          description: "Your SGPA has been saved successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchSGPARecords(); // Fetch updated SGPA records after saving
      } else {
        console.error('Failed to save SGPA');
      }
    } catch (error) {
      console.error('Error saving SGPA:', error);
    } finally {
      setIsConfirmVisible(false);
    }
  };

  // Delete SGPA record
  const deleteSGPA = async (id) => {
    try {
      const response = await Api.delete(`/api/sgpa/${id}`);
      if (response.status === 200) {
        toast({
          title: "SGPA Deleted",
          description: "The SGPA record has been deleted successfully.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        fetchSGPARecords(); // Refresh the list after deletion
      } else {
        console.error('Failed to delete SGPA');
      }
    } catch (error) {
      console.error('Error deleting SGPA:', error);
    }
  };

  return (
    <ChakraProvider>
      <Flex direction={{ base: 'column', lg: 'row' }} p={5} gap={10} maxWidth="1200px" mx="auto" mt={10}>
        <Box bg={bgColor} p={5} borderRadius="lg" shadow="md" flex="1">
          <Heading as="h2" size="xl" textAlign="center" mb={6}>
            SGPA Calculator
          </Heading>

          <FormControl id="semester" mb={4}>
            <FormLabel>Semester</FormLabel>
            <Select
              placeholder="Select Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </Select>
          </FormControl>

          {courses.map((course, index) => (
            <HStack key={index} mb={4} alignItems="center">
              <FormControl id={`credits-${index}`} isRequired>
                <FormLabel>Credits</FormLabel>
                <Input
                  type="number"
                  name="credits"
                  value={course.credits || ''}
                  onChange={(e) => handleChange(index, e)}
                  min="0"
                  placeholder="Enter credits"
                />
              </FormControl>

              <FormControl id={`grade-${index}`} isRequired>
                <FormLabel>Grade</FormLabel>
                <Select
                  name="grade"
                  value={course.grade || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Select grade"
                >
                  {Object.keys(gradeToPoint).map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </Select>
              </FormControl>

              <IconButton
                icon={<CloseIcon />}
                colorScheme="red"
                onClick={() => handleRemoveCourse(index)}
              />
            </HStack>
          ))}

          <Flex justifyContent="space-between" my={6}>
            <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleAddCourse}>
              Add Course
            </Button>
            <Button colorScheme="blue" onClick={calculateSGPA}>
              Calculate SGPA
            </Button>
          </Flex>

          {sgpa && (
            <Box mt={4} textAlign="center">
              <Text fontSize="lg">Your SGPA is: <strong>{sgpa}</strong></Text>
              {cgpa !== null && <Text fontSize="lg">Your CGPA is: <strong>{cgpa}</strong></Text>}
              {isConfirmVisible && (
                <Flex justifyContent="center" mt={4} gap={4}>
                  <Button colorScheme="green" onClick={saveSGPA}>Save SGPA</Button>
                  <Button colorScheme="red" onClick={() => setIsConfirmVisible(false)}>Cancel</Button>
                </Flex>
              )}
            </Box>
          )}
        </Box>

        {/* SGPA Records Section */}
        <Box bg={bgColor} p={5} borderRadius="lg" shadow="md" flex="1">
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            SGPA Records
          </Heading>

          {sgpaRecords?.length > 0 ? (
  <VStack spacing={4}>
    {sgpaRecords.map(record => (
      <Flex
        key={record._id} // Make sure this matches your backend response field (e.g., _id or id)
        justifyContent="space-between"
        alignItems="center"
        bg="gray.100"
        p={4}
        borderRadius="lg"
        w="100%"
        shadow="md"
      >
        <Text fontSize="lg">Semester {record.semester}: SGPA {record.sgpa}</Text>
        <IconButton
          icon={<DeleteIcon />}
          colorScheme="red"
          onClick={() => deleteSGPA(record._id)} // Use _id or id based on what is returned by the backend
          aria-label="Delete SGPA"
        />
      </Flex>
    ))}
  </VStack>
) : (
  <Text textAlign="center" fontSize="lg">
    No SGPA records available.
  </Text>
)}

        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default CalCpga;
