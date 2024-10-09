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
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

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

      if (response.status !== 200 || !response.data) {
        throw new Error('Failed to fetch students. Please try again.');
      }

      setStudents(Array.isArray(response.data) ? response.data : []);
      setError('');
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
      setLoading(false);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStudents.map(student => ({
      Name: student.name,
      RegistrationNumber: student.Reg,
      DateOfBirth: new Date(student.dob).toLocaleDateString(),
      Gender: student.gender,
      Email: student.email,
      CGPA: student.cgpa,
      SGPA: student.sgpas?.map(sgpa => `Semester ${sgpa.semester}: ${sgpa.sgpa}`).join(', ')
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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.Reg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChakraProvider>
    <Box p={6} maxWidth="1200px" margin="0 auto">
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Registered Students Dashboard
      </Heading>

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
          leftElement={<SearchIcon color="gray.300" />}
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

      {loading ? (
        <Box textAlign="center">
          <Spinner size="xl" />
        </Box>
      ) : filteredStudents.length > 0 ? (
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
                  <Td>{student.name}</Td>
                  <Td>{student.Reg}</Td>
                  <Td>{new Date(student.dob).toLocaleDateString()}</Td>
                  <Td>{student.gender}</Td>
                  <Td>{student.email}</Td>
                  <Td>{student.cgpa}</Td>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedStudent && (
              <VStack align="stretch" spacing={3}>
                <Text><strong>Name:</strong> {selectedStudent.name}</Text>
                <Text><strong>Registration Number:</strong> {selectedStudent.Reg}</Text>
                <Text><strong>Date of Birth:</strong> {new Date(selectedStudent.dob).toLocaleDateString()}</Text>
                <Text><strong>Gender:</strong> {selectedStudent.gender}</Text>
                <Text><strong>Email:</strong> {selectedStudent.email}</Text>
                <Text><strong>CGPA:</strong> {selectedStudent.cgpa}</Text>
                <Text><strong>SGPA:</strong></Text>
                <VStack align="stretch" pl={4}>
                  {selectedStudent.sgpas?.map((sgpa) => (
                    <Text key={sgpa._id}>
                      Semester {sgpa.semester}: {sgpa.sgpa}
                    </Text>
                  ))}
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