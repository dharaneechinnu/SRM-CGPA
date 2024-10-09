import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  VStack,
  HStack,
  Badge,
  IconButton,
  Text,
  useToast,
  SimpleGrid,
  ChakraProvider,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'; // Icons for approval and rejection
import Api from '../../Api/Api';

const TeacherApprove = () => {
  const [requests, setRequests] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Fetch teacher data from localStorage
    const teacher = JSON.parse(localStorage.getItem('teacher'));
    const section = teacher?.user.section;
    const year = teacher?.user.year;

    if (teacher) {
      // Make API call to fetch leave requests for the teacher's section and year
      const fetchLeaveRequests = async () => {
        try {
          const response = await Api.post('/student/leave-requests', 
          { section, year, status: 'pending' },
          );
          if (response.status === 200) {
            setRequests(response.data.leaveRequests);
            console.log("Leave Request data from frontend : ",response.data)
          }
        } catch (error) {
          toast({
            title: 'Error fetching leave requests.',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };

      fetchLeaveRequests();
    }
  }, [toast]);

  const handleApprove = async (leaveId, index) => {
    try {
      const response = await Api.post('/student/leave-request/approve', {
        leaveId,
        status: 'approved',
      });
console.log(leaveId)
      if (response.status === 200) {
        const updatedRequests = [...requests];
        updatedRequests[index].status = 'Approved';
        setRequests(updatedRequests);
        toast({
          title: 'Request Approved',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error approving request.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeny = async (leaveId, index) => {
    try {
      const response = await Api.post('/teacher/approve-leave', {
        leaveId,
        status: 'rejected',
      });

      if (response.status === 200) {
        const updatedRequests = [...requests];
        updatedRequests[index].status = 'Denied';
        setRequests(updatedRequests);
        toast({
          title: 'Request Denied',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error denying request.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
                    <Text fontWeight="bold">{request.studentName}</Text>
                    <Badge
                      colorScheme={
                        request.status === 'Approved' ? 'green' : request.status === 'Denied' ? 'red' : 'yellow'
                      }
                    >
                      {request.status}
                    </Badge>
                  </HStack>
                  <Text>Name: {request.studentName}</Text>
                  <Text>RegNo: {request.RegNo}</Text>
                  <Text>From: {new Date(request.startDate).toLocaleDateString()}</Text>
                  <Text>To: {new Date(request.endDate).toLocaleDateString()}</Text>
                  <Text>Reason: {request.leaveReason}</Text>

                  {/* Approve and Deny buttons with icons */}
                  {request.status === 'pending' && (
                    <HStack mt={3} justify="space-between">
                      <IconButton
                        aria-label="Approve"
                        icon={<CheckIcon />}
                        colorScheme="green"
                        onClick={() => handleApprove(request._id, index)}
                      />
                      <IconButton
                        aria-label="Deny"
                        icon={<CloseIcon />}
                        colorScheme="red"
                        onClick={() => handleDeny(request._id, index)}
                      />
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
