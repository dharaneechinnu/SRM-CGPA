import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Flex,
  IconButton,
  VStack,
  Stack,
  HStack,
  ChakraProvider,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import Api from '../Api/Api';

const CertificateUpload = () => {
  const [courseName, setCourseName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [uploadedCertificates, setUploadedCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState('upload');
  const [editMode, setEditMode] = useState(false);
  const [editCert, setEditCert] = useState(null);
  const toast = useToast();

  const userid = localStorage.getItem("CGPA-User");
  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;

  useEffect(() => {
    if (currentPage === 'show') {
      const fetchCertificates = async () => {
        try {
          const response = await Api.get(`/api/${reg}`);
          setUploadedCertificates(response.data.certificates || []);
        } catch (error) {
          console.error('Error fetching certificates:', error);
        }
      };

      fetchCertificates();
    }
  }, [currentPage, reg]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!certificateUrl || !courseName) {
      toast({
        title: 'Error',
        description: 'Please enter both course name and certificate URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editMode) {
        await Api.put(`/api/edit-certificate/${editCert._id}`, { courseName, certificateUrl, reg });
        toast({
          title: 'Success',
          description: 'Certificate updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setEditMode(false);
        setEditCert(null);
      } else {
        await Api.post('/api/upload-certificate', { courseName, certificateUrl, reg });
        toast({
          title: 'Success',
          description: 'Certificate submitted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      setCourseName('');
      setCertificateUrl('');
      setCurrentPage('show');
    } catch (error) {
      console.error('Error submitting certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit the certificate',
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

  const handleDeleteClick = async (certId) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await Api.delete(`/api/delete-certificate/${certId}`);
        toast({
          title: 'Deleted',
          description: 'Certificate deleted successfully',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        setUploadedCertificates(uploadedCertificates.filter(cert => cert._id !== certId));
      } catch (error) {
        console.error('Error deleting certificate:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete the certificate',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleUploadClick = () => setCurrentPage('upload');
  const handleShowClick = () => setCurrentPage('show');

  return (
    <ChakraProvider>
    <Box p={6} maxW="800px" mx="auto">
      <Flex justify="center" mb={4}>
        <Button
          colorScheme={currentPage === 'upload' ? 'blue' : 'gray'}
          onClick={handleUploadClick}
          leftIcon={<AddIcon />}
          mr={3}
        >
          {editMode ? 'Edit Certificate' : 'Upload Certificate'}
        </Button>
        <Button
          colorScheme={currentPage === 'show' ? 'blue' : 'gray'}
          onClick={handleShowClick}
        >
          Show Certificates
        </Button>
      </Flex>

      {currentPage === 'upload' ? (
        <VStack spacing={4} align="start">
          <Heading size="lg">{editMode ? 'Edit Certificate' : 'Upload Certificate'}</Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Course Name</FormLabel>
                <Input
                  placeholder="Enter course name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Certificate URL</FormLabel>
                <Input
                  placeholder="Enter certificate URL"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue">
                {editMode ? 'Update' : 'Submit'}
              </Button>
            </Stack>
          </form>
        </VStack>
      ) : (
        <Box>
          <Heading size="lg" mb={4}>Submitted Certificates</Heading>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Course Name</Th>
                <Th>Certificate Link</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {uploadedCertificates.map((cert, index) => (
                <Tr key={index}>
                  <Td>{cert.courseName}</Td>
                  <Td>
                    <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                      View Certificate
                    </a>
                  </Td>
                  <Td>
                    <HStack>
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="green"
                        onClick={() => handleEditClick(cert)}
                        aria-label="Edit Certificate"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => handleDeleteClick(cert._id)}
                        aria-label="Delete Certificate"
                      />
                    </HStack>
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

export default CertificateUpload;
