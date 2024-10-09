import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  VStack,
  HStack,
  Badge,
  Button,
  Text,
  useToast,
  SimpleGrid,
  ChakraProvider,
} from '@chakra-ui/react';

const TeacherApprove = () => {
  const [requests, setRequests] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Fetch leave requests from localStorage (simulating API call)
    const storedRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    setRequests(storedRequests);
  }, []);

  const handleApprove = (index) => {
    const updatedRequests = [...requests];
    updatedRequests[index].status = 'Approved';
    setRequests(updatedRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
    toast({
      title: 'Request Approved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeny = (index) => {
    const updatedRequests = [...requests];
    updatedRequests[index].status = 'Denied';
    setRequests(updatedRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));
    toast({
      title: 'Request Denied',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <ChakraProvider>
    <Flex justify="center" align="center" height="100vh" bg="gray.50" p={5}>
      <Box bg="white" p={8} rounded="lg" boxShadow="lg" maxW="800px" width="100%">
        <Heading size="lg" mb={6} textAlign="center">
          Leave Requests
        </Heading>
        {requests.length === 0 ? (
          <Text>No leave requests submitted yet.</Text>
        ) : (
          <SimpleGrid columns={1} spacing={4}>
            {requests.map((request, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                <HStack justify="space-between" mb={3}>
                  <Text fontWeight="bold">{request.name}</Text>
                  <Badge
                    colorScheme={
                      request.status === 'Approved' ? 'green' : request.status === 'Denied' ? 'red' : 'yellow'
                    }
                  >
                    {request.status}
                  </Badge>
                </HStack>
                <Text>Email: {request.email}</Text>
                <Text>From: {new Date(request.fromDate).toLocaleDateString()}</Text>
                <Text>To: {new Date(request.toDate).toLocaleDateString()}</Text>
                <Text>Reason: {request.reason}</Text>

                {/* Approve and Deny buttons */}
                {request.status === 'Pending' && (
                  <HStack mt={3} justify="space-between">
                    <Button colorScheme="green" onClick={() => handleApprove(index)}>
                      Approve
                    </Button>
                    <Button colorScheme="red" onClick={() => handleDeny(index)}>
                      Deny
                    </Button>
                  </HStack>
                )}
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Flex>
         </ChakraProvider>
  );
};

export default TeacherApprove;
