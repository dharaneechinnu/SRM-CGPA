import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  useColorModeValue,
  ChakraProvider,
} from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Api from '../Api/Api';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Target = () => {
  const [semesterData, setSemesterData] = useState([]);
  const [targetCgpa, setTargetCgpa] = useState('');
  const [isTargetSet, setIsTargetSet] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.100', 'gray.700');
  const userid = localStorage.getItem("CGPA-User");
  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;

  // Fetch semester data from the backend
  useEffect(() => {
    const fetchSemesterData = async () => {
      try {
        const response = await Api.get(`/api/sgpa/${reg}`);
        if (response.status === 200) {
          const data = response.data.sgpas || [];
          setSemesterData(data);
        } else {
          console.error('Failed to fetch semester data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching semester data:', error);
      }
    };
    fetchSemesterData();
  }, [reg]);

  const handleTargetChange = (e) => {
    setTargetCgpa(e.target.value);
  };

  const handleSetTarget = async () => {
    try {
      const response = await Api.post('/api/set-target', { targetCgpa, reg });
      if (response.status === 200) {
        setIsTargetSet(true);
        toast({
          title: "Target CGPA Set",
          description: `Your target CGPA has been set to ${targetCgpa}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error('Failed to set target CGPA:', response.status);
      }
    } catch (error) {
      console.error('Error setting target CGPA:', error);
    }
  };

  // Prepare data for the chart
  const chartData = {
    labels: semesterData.map(item => `Semester ${item.semester}`),
    datasets: [
      {
        label: 'SGPA',
        data: semesterData.map(item => item.sgpa),
        backgroundColor: 'rgba(72, 187, 120, 0.5)',
        borderColor: '#48bb78',
        borderWidth: 2,
        borderRadius: 5,
        barThickness: 40,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: useColorModeValue('#2D3748', '#CBD5E0'),
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `SGPA: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: useColorModeValue('#2D3748', '#CBD5E0'),
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          color: useColorModeValue('#2D3748', '#CBD5E0'),
        },
        grid: {
          color: useColorModeValue('#E2E8F0', '#4A5568'),
        },
      },
    },
  };

  return (
    <ChakraProvider>
      <Flex direction="column" alignItems="center" justifyContent="center" p={8} minH="100vh" bg={bgColor}>
        <Box maxW="900px" w="full" textAlign="center">
          <Heading as="h1" size="2xl" mb={6}>
            Target CGPA
          </Heading>

          <VStack spacing={8} w="full">
            {/* Chart Section */}
            <Box bg={cardBg} p={8} shadow="lg" borderRadius="lg" w="full">
              <Bar data={chartData} options={chartOptions} />
            </Box>

            {/* Set Target CGPA Section */}
            <Box bg={cardBg} p={8} shadow="lg" borderRadius="lg" w="full" textAlign="center">
              <Heading as="h2" size="lg" mb={4}>
                Set Your Target CGPA
              </Heading>
              <Input
                placeholder="Enter target CGPA"
                type="number"
                value={targetCgpa}
                onChange={handleTargetChange}
                size="lg"
                mb={4}
                w="50%"
                textAlign="center"
                bg={useColorModeValue('gray.50', 'gray.600')}
                mx="auto"
              />
              <Button colorScheme="blue" size="lg" onClick={handleSetTarget}>
                Set Target
              </Button>
              {isTargetSet && (
                <Text mt={4} fontSize="lg" color="green.500">
                  Target CGPA set to {targetCgpa}
                </Text>
              )}
            </Box>
          </VStack>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Target;
