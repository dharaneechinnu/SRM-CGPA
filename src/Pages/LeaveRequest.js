import React, { useState } from 'react';
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
} from '@chakra-ui/react';

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fromDate: '',
    toDate: '',
    reason: '',
  });

  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit form data to localStorage (for now, simulate a backend call)
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    localStorage.setItem('leaveRequests', JSON.stringify([...leaveRequests, { ...formData, status: 'Pending' }]));

    // Reset form data
    setFormData({
      name: '',
      email: '',
      fromDate: '',
      toDate: '',
      reason: '',
    });

    // Show success message
    toast({
      title: 'Leave request sent.',
      description: 'Your leave request has been submitted successfully.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  return (
    <Flex justify="center" align="center" height="100vh" bg="gray.50" p={5}>
      <Box
        bg="white"
        p={8}
        rounded="lg"
        boxShadow="lg"
        maxW="500px"
        width="100%"
        as="form"
        onSubmit={handleSubmit}
      >
        <Heading size="lg" mb={6} textAlign="center">
          Leave Request Form
        </Heading>
        <VStack spacing={4} align="stretch">
          <FormControl id="name" isRequired>
            <FormLabel>Student Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl id="fromDate" isRequired>
            <FormLabel>From Date</FormLabel>
            <Input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="toDate" isRequired>
            <FormLabel>To Date</FormLabel>
            <Input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="reason" isRequired>
            <FormLabel>Reason for Leave</FormLabel>
            <Textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter the reason for leave"
              rows={4}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg" width="100%" mt={4}>
            Submit Leave Request
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LeaveRequest;
