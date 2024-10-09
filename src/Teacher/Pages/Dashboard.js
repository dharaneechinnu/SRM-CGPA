  import React, { useState, useEffect } from 'react';
  import {
    Box,
    Heading,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    VStack,
    HStack,
    useToast,
    Spinner,
    ChakraProvider,
  } from '@chakra-ui/react';
  import { DownloadIcon, SearchIcon } from '@chakra-ui/icons';
  import * as XLSX from 'xlsx';
  import Api from '../../Api/Api';

  const StudentDashboard = () => {
    const [students, setStudents] = useState([]);  // Students data
    const [searchQuery, setSearchQuery] = useState('');  // Search query
    const [error, setError] = useState('');  // Error handling
    const [loading, setLoading] = useState(true);  // Loading state
    const [selectedStudent, setSelectedStudent] = useState(null);  // Selected student details
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
      fetchStudents();
    }, []);

    // Fetch students from API
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const teacher = JSON.parse(localStorage.getItem('teacher'));
        if (!teacher?.user?.year || !teacher?.user?.section) {
          throw new Error('Teacher year and section data is missing in localStorage.');
        }

        const { year, section } = teacher.user;
        const response = await Api.post(
          '/teacher/getstd',
          { year, section },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        // Check if API response is valid
        if (response.status !== 200 || !response.data) {
          throw new Error('Failed to fetch students. Please try again.');
        }

        setStudents(Array.isArray(response.data) ? response.data : []);  // Set student data
        setError('');  // Clear any previous errors
        console.log("studentdata", students);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching students.');
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch students',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    // Handle student details modal
    const handleStudentClick = (student) => {
      setSelectedStudent(student);
      onOpen();
    };

    // Download student data as Excel
    const handleDownloadExcel = () => {
      const ws = XLSX.utils.json_to_sheet(filteredStudents.map(student => ({
        Name: student.name || 'N/A',  // Handle missing name
        RegistrationNumber: student.Reg || 'N/A',  // Handle missing Reg
        DateOfBirth: student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A',  // Handle missing dob
        Gender: student.gender || 'N/A',  // Handle missing gender
        Email: student.email || 'N/A',  // Handle missing email
        CGPA: student.cgpa || 'N/A',  // Handle missing CGPA
        SGPA: student.sgpas?.map(sgpa => `Semester ${sgpa.semester}: ${sgpa.sgpa}`).join(', ') || 'N/A'  // Handle missing SGPA
        
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      XLSX.writeFile(wb, 'StudentsData.xlsx');
      toast({
        title: 'Success',
        description: 'Excel file downloaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    };

   // Filter students based on search query (includes name, registration number, and CGPA)
const filteredStudents = students.filter(
  (student) => {
    const searchValue = searchQuery.toLowerCase();
    
    // Check if the search query matches any of the name, Reg, or CGPA fields
    return (
      (student.name?.toLowerCase() || '').includes(searchValue) ||
      (student.Reg?.toLowerCase() || '').includes(searchValue) ||
      (student.cgpa?.toString().includes(searchValue))  // Search by CGPA
    );
  }
);


    return (
      <ChakraProvider>
        <Box p={6} maxWidth="1200px" margin="0 auto">
          <Heading as="h1" size="xl" textAlign="center" mb={6}>
            Registered Students Dashboard
          </Heading>

          {/* Error message */}
          {error && (
            <Text color="red.500" textAlign="center" mb={4}>
              {error}
            </Text>
          )}

          <HStack spacing={4} mb={6}>
            <Input
              placeholder="Search by name or registration number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="green"
              onClick={handleDownloadExcel}
              isDisabled={filteredStudents.length === 0}
            >
              Download Excel
            </Button>
          </HStack>

          {/* Loading spinner */}
          {loading ? (
            <Box textAlign="center">
              <Spinner size="xl" />
            </Box>
          ) : students.length > 0 ? (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Registration Number</Th>
                    <Th>Date of Birth</Th>
                    <Th>Gender</Th>
                    <Th>Email</Th>
                    <Th>CGPA</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredStudents.map((student) => (
                    <Tr key={student._id}>
                      <Td>{student.name || 'N/A'}</Td>
                      <Td>{student.Reg || 'N/A'}</Td>
                      <Td>{student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</Td>
                      <Td>{student.gender || 'N/A'}</Td>
                      <Td>{student.email || 'N/A'}</Td>
                      <Td>{student.cgpa || 'N/A'}</Td>
                      <Td>
                        <Button size="sm" onClick={() => handleStudentClick(student)}>
                          View Details
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Text textAlign="center">No students found.</Text>
          )}

          {/* Modal for student details */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Student Details</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedStudent && (
                  <VStack align="stretch" spacing={3}>
                    <Text><strong>Name:</strong> {selectedStudent.name || 'N/A'}</Text>
                    <Text><strong>Registration Number:</strong> {selectedStudent.Reg || 'N/A'}</Text>
                    <Text><strong>Date of Birth:</strong> {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : 'N/A'}</Text>
                    <Text><strong>Gender:</strong> {selectedStudent.gender || 'N/A'}</Text>
                    <Text><strong>Email:</strong> {selectedStudent.email || 'N/A'}</Text>
                    <Text><strong>CGPA:</strong> {selectedStudent.cgpa || 'N/A'}</Text>
                    <Text><strong>SGPA:</strong></Text>
                    <VStack align="stretch" pl={4}>
                      {selectedStudent.sgpas?.map((sgpa) => (
                        <Text key={sgpa._id}>
                          Semester {sgpa.semester}: {sgpa.sgpa}
                        </Text>
                      )) || <Text>No SGPA records available.</Text>}
                    </VStack>
                  </VStack>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </ChakraProvider>
    );
  };

  export default StudentDashboard;
