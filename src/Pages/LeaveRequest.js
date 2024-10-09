import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  Grid,
  GridItem,
  Badge,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import Api from '../Api/Api';

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    RegNo: '',
    studentName: '',
    section: '',
    year: '',
    leaveReason: '',
    startDate: '',
    endDate: '',
  });

  const [leaveRequests, setLeaveRequests] = useState([]); // To store fetched leave requests
  const toast = useToast();

  // Effect to fetch user data from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('CGPA-User'));
    const RegNo = user?.user?.Reg;
    console.log(RegNo);

    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        studentName: user?.user?.name || '',
        section: user?.user?.section || '',
        year: user?.user?.year || '',
        RegNo: user?.user?.Reg || '', // Assuming 'Reg' is also stored in user data
      }));
    }

    // Fetch leave requests for the student
    const fetchLeaveRequests = async () => {
      try {
        const response = await Api.post('/student/leave-requestreg', { RegNo: user?.user?.Reg });
        console.log('frontend : ', response);
        if (response.status === 200) {
          setLeaveRequests(response.data.leaveRequests);
        }
      } catch (error) {
        console.log('frontend : ', error);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Api.post('/student/leave-request', formData);

      if (response.status === 200) {
        // Reset form data
        setFormData({
          leaveReason: '',
          startDate: '',
          endDate: '',
        });

        // Show success message
        toast({
          title: 'Leave request sent.',
          description: 'Your leave request has been submitted successfully.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });

        // Re-fetch leave requests after submitting a new one
        const updatedRequests = await Api.get(`/student/leave-requests?RegNo=${formData.RegNo}`);
        setLeaveRequests(updatedRequests.data.leaveRequests);
      }
    } catch (error) {
      // Show error message
      toast({
        title: 'Error occurred.',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      console.log(error.message);
    }
  };

  return (
    <Flex justify="center" align="center" height="100vh" bg="gray.50" p={5}>
      <Box
        bg="white"
        p={8}
        rounded="lg"
        boxShadow="lg"
        maxW="1200px"
        width="100%"
      >
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          {/* Left Section - Leave Request Form */}
          <GridItem>
            <Box>
              <Heading size="lg" mb={6} textAlign="center">
                Leave Request Form
              </Heading>
              <VStack spacing={4} align="stretch">
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <GridItem>
                    <FormControl id="RegNo" isRequired>
                      <FormLabel>Registration Number</FormLabel>
                      <Input
                        type="text"
                        name="RegNo"
                        value={formData.RegNo}
                        readOnly // Make it read-only since it's populated from local storage
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl id="studentName" isRequired>
                      <FormLabel>Student Name</FormLabel>
                      <Input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        readOnly // Make it read-only since it's populated from local storage
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl id="section" isRequired>
                      <FormLabel>Section</FormLabel>
                      <Input
                        type="text"
                        name="section"
                        value={formData.section}
                        readOnly // Make it read-only since it's populated from local storage
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl id="year" isRequired>
                      <FormLabel>Year</FormLabel>
                      <Input
                        type="text"
                        name="year"
                        value={formData.year}
                        readOnly // Make it read-only since it's populated from local storage
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={2}>
                    <FormControl id="leaveReason" isRequired>
                      <FormLabel>Leave Reason</FormLabel>
                      <Textarea
                        name="leaveReason"
                        value={formData.leaveReason}
                        onChange={handleChange}
                        placeholder="Enter the reason for leave"
                        rows={4}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl id="startDate" isRequired>
                      <FormLabel>Start Date</FormLabel>
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl id="endDate" isRequired>
                      <FormLabel>End Date</FormLabel>
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                <Button type="submit" colorScheme="blue" size="lg" width="100%" mt={4} onClick={handleSubmit}>
                  Submit Leave Request
                </Button>
              </VStack>
            </Box>
          </GridItem>

          {/* Right Section - Leave Request Status */}
          <GridItem>
            <Box height="500px" overflowY="auto" p={4} borderWidth="1px" borderRadius="lg" boxShadow="lg">
              <Heading size="lg" mb={6} textAlign="center">
                Leave History
              </Heading>
              {leaveRequests.length === 0 ? (
                <Text>No leave requests submitted yet.</Text>
              ) : (
                <SimpleGrid columns={1} spacing={4}>
                  {leaveRequests.map((request, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50" boxShadow="md">
                      <Flex justify="space-between" mb={3}>
                        <Text fontWeight="bold">{request.leaveReason}</Text>
                        <Badge colorScheme={request.status === 'approved' ? 'green' : request.status === 'rejected' ? 'red' : 'yellow'}>
                          {request.status}
                        </Badge>
                      </Flex>
                      <Text>From: {new Date(request.startDate).toLocaleDateString()}</Text>
                      <Text>To: {new Date(request.endDate).toLocaleDateString()}</Text>
                      <Text>Submitted on: {new Date(request.createdAt).toLocaleDateString()}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
};

export default LeaveRequest;
