import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  useToast,
  IconButton,
  Tooltip,
  ChakraProvider,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, ViewIcon } from '@chakra-ui/icons';
import Api from '../Api/Api';

const ResumeUpload = () => {
  const [courseName, setCourseName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [uploadedCertificates, setUploadedCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState('upload');
  const [editMode, setEditMode] = useState(false);
  const [editCert, setEditCert] = useState(null);
  const toast = useToast();

  const userid = localStorage.getItem('CGPA-User');
  let parsedUser;
  try {
    parsedUser = JSON.parse(userid);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
  }
  const reg = parsedUser?.user?.Reg;

  useEffect(() => {
    if (currentPage === 'show') {
      const fetchCertificates = async () => {
        try {
          if (!reg) {
            console.error('Registration number is not defined.');
            return;
          }

          const response = await Api.get(`/api/resume/${reg}`);
          setUploadedCertificates(response.data.certificates || []);
        } catch (error) {
          console.error('Error fetching certificates:', error);
        }
      };

      fetchCertificates();
    }
  }, [currentPage, reg]);

  const handleDeleteClick = async (certId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await Api.delete(`/api/delete-resume/${certId}`);
        toast({
          title: 'Resume deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setUploadedCertificates(uploadedCertificates.filter((cert) => cert._id !== certId));
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast({
          title: 'Error deleting resume.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!certificateUrl || !courseName) {
      toast({
        title: 'Please enter both a URL and course name.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editMode) {
        await Api.put(`/api/edit-resume/${editCert._id}`, { courseName, certificateUrl, reg });
        toast({
          title: 'Resume updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setEditMode(false);
        setEditCert(null);
      } else {
        await Api.post('/api/upload-resume', { courseName, certificateUrl, reg });
        toast({
          title: 'Resume link submitted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      setCourseName('');
      setCertificateUrl('');
      setCurrentPage('show');
    } catch (error) {
      console.error('Error submitting resume:', error);
      toast({
        title: 'Error submitting resume.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (cert) => {
    setEditCert(cert);
    setCourseName(cert.courseName);
    setCertificateUrl(cert.certificateUrl);
    setEditMode(true);
    setCurrentPage('upload');
  };

  return (
    <ChakraProvider>
      <Box maxW="800px" mx="auto" p={5}>
        <Flex justify="center" mb={6}>
          <Button
            onClick={() => setCurrentPage('upload')}
            colorScheme={currentPage === 'upload' ? 'blue' : 'gray'}
            mr={3}
            leftIcon={<AddIcon />}
          >
            {editMode ? 'Edit Resume' : 'Upload Resume'}
          </Button>
          <Button
            onClick={() => setCurrentPage('show')}
            colorScheme={currentPage === 'show' ? 'blue' : 'gray'}
            leftIcon={<ViewIcon />}
          >
            Show Resumes
          </Button>
        </Flex>

        {currentPage === 'upload' ? (
          <VStack as="form" spacing={4} onSubmit={handleSubmit}>
            <Heading as="h3" size="lg" mb={6}>
              {editMode ? 'Edit Resume' : 'Upload Resume'}
            </Heading>
            <FormControl id="course-name" isRequired>
              <FormLabel>Resume Name (Company):</FormLabel>
              <Input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter the resume name"
              />
            </FormControl>
            <FormControl id="certificate-url" isRequired>
              <FormLabel>Resume URL:</FormLabel>
              <Input
                type="text"
                value={certificateUrl}
                onChange={(e) => setCertificateUrl(e.target.value)}
                placeholder="Enter the resume URL"
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" leftIcon={<AddIcon />}>
              {editMode ? 'Update' : 'Submit'}
            </Button>
          </VStack>
        ) : (
          <Box>
            <Heading as="h3" size="lg" mb={6}>
              Resume List
            </Heading>
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Resume Name</Th>
                  <Th>Resume Link</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {uploadedCertificates.map((cert, index) => (
                  <Tr key={index}>
                    <Td>{cert.courseName}</Td>
                    <Td>
                      <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                        View Resume
                      </a>
                    </Td>
                    <Td>
                      <Tooltip label="Edit Resume" aria-label="Edit Resume">
                        <IconButton
                          icon={<EditIcon />}
                          colorScheme="green"
                          mr={2}
                          onClick={() => handleEditClick(cert)}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Resume" aria-label="Delete Resume">
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => handleDeleteClick(cert._id)}
                        />
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default ResumeUpload;
