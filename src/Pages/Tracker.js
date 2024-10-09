import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  ChakraProvider,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import Api from '../Api/Api'; // Ensure you have the Api module for API calls

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Tracker = () => {
  const [semesterData, setSemesterData] = useState([]);
  const [targetCgpa, setTargetCgpa] = useState(null);
  const [requiredSgpas, setRequiredSgpas] = useState([]);
  const userid = localStorage.getItem("CGPA-User");
  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;
  const totalSemesters = 8;
  const futureSemesters = totalSemesters - (semesterData?.length || 0);

  // Define colors using useColorModeValue at the top
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const tooltipLabelColor = useColorModeValue('#1A202C', '#CBD5E0');
  const gridColor = useColorModeValue('#E2E8F0', '#4A5568');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sgpaResponse = await Api.get(`/api/sgpas/${reg}`);
        if (sgpaResponse.status === 200 && Array.isArray(sgpaResponse.data.sgpas)) {
          setSemesterData(sgpaResponse.data.sgpas);
        } else {
          setSemesterData([]);
        }

        const targetResponse = await Api.get(`/api/target-cgpa/${reg}`);
        if (targetResponse.status === 200 && targetResponse.data) {
          setTargetCgpa(targetResponse.data.targetCgpa);
        } else {
          setTargetCgpa(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSemesterData([]);
        setTargetCgpa(null);
      }
    };

    fetchData();
  }, [reg]);

  useEffect(() => {
    const calculateRequiredSgpas = () => {
      if (targetCgpa !== null && semesterData.length > 0) {
        const currentSemesters = semesterData.length;
        const currentCgpa = semesterData.reduce((acc, { sgpa }) => acc + sgpa, 0) / currentSemesters;
        const requiredSgpaTotal = (targetCgpa * totalSemesters) - (currentCgpa * currentSemesters);
        const futureSgpas = futureSemesters > 0 ? Array(futureSemesters).fill(requiredSgpaTotal / futureSemesters) : [];
        setRequiredSgpas(futureSgpas);
      }
    };

    calculateRequiredSgpas();
  }, [targetCgpa, semesterData, futureSemesters]);

  const chartData = {
    labels: [
      ...semesterData.map(({ semester }) => `Semester ${semester}`),
      ...Array(futureSemesters).fill('Future Semester'),
    ],
    datasets: [
      {
        label: 'Current SGPA',
        data: [...semesterData.map(({ sgpa }) => sgpa), ...Array(futureSemesters).fill(null)],
        backgroundColor: 'rgba(66, 153, 225, 0.5)',
        borderColor: '#4299e1',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Required SGPA',
        data: [...Array(semesterData.length).fill(null), ...requiredSgpas],
        backgroundColor: 'rgba(245, 101, 101, 0.5)',
        borderColor: '#f56565',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: tooltipLabelColor, // Use the color variable here
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
          color: tooltipLabelColor, // Use the color variable here
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: tooltipLabelColor, // Use the color variable here
        },
        grid: {
          color: gridColor, // Use the color variable here
        },
      },
    },
  };

  return (
    <ChakraProvider>
      <Flex direction="column" alignItems="center" justifyContent="center" p={8} minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Box maxW="900px" w="full" textAlign="center">
          <Heading as="h1" size="2xl" mb={8}>
            CGPA Tracker
          </Heading>

          {/* Chart Section */}
          {semesterData.length > 0 ? (
            <Box bg={bgColor} p={8} shadow="lg" borderRadius="lg" mb={8}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          ) : (
            <Spinner size="xl" color="blue.500" />
          )}

          {/* Info Section */}
          <VStack spacing={4} textAlign="center">
            {targetCgpa !== null ? (
              <Text fontSize="lg" color={textColor}>
                Current Target CGPA: <strong>{targetCgpa}</strong>
              </Text>
            ) : (
              <Text fontSize="lg" color="red.500">Loading target CGPA...</Text>
            )}
          </VStack>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Tracker;
