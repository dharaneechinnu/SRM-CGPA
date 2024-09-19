import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components';
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

  const totalSemesters = 8; // Total number of semesters
  const futureSemesters = totalSemesters - (semesterData.length || 0); // Calculate future semesters dynamically

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sgpaResponse = await Api.get(`/api/sgpas/${reg}`);
        console.log('SGPA Response:', sgpaResponse.data);
        if (sgpaResponse.status === 200) {
          setSemesterData(sgpaResponse.data || []);
        } else {
          console.error('Failed to fetch SGPA data:', sgpaResponse.status);
        }

        const targetResponse = await Api.get(`/api/target-cgpa/${reg}`);
        console.log('Target Response:', targetResponse.data);
        if (targetResponse.status === 200) {
          setTargetCgpa(targetResponse.data.targetCgpa || null);
        } else {
          console.error('Failed to fetch target CGPA:', targetResponse.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [reg]);

  useEffect(() => {
    const calculateRequiredSgpas = () => {
      console.log('Semester Data:', semesterData);
      console.log('Target CGPA:', targetCgpa);

      if (targetCgpa !== null && semesterData.length > 0) {
        const currentSemesters = semesterData.length;
        const currentCgpa = semesterData.reduce((acc, { sgpa }) => acc + sgpa, 0) / currentSemesters;

        const requiredCgpa = parseFloat(targetCgpa);
        const requiredSgpaTotal = (requiredCgpa * totalSemesters) - (currentCgpa * currentSemesters);

        const futureSgpas = Array(futureSemesters).fill(requiredSgpaTotal / futureSemesters);

        setRequiredSgpas(futureSgpas);
      }
    };

    calculateRequiredSgpas();
  }, [targetCgpa, semesterData]);

  const chartData = {
    labels: [
      ...semesterData.map(({ semester }) => `Semester ${semester}`),
      ...Array(futureSemesters).fill('Future Semester')
    ],
    datasets: [
      {
        label: 'Current SGPA',
        data: [...semesterData.map(({ sgpa }) => sgpa), ...Array(futureSemesters).fill(null)],
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: '#007bff',
        borderWidth: 1,
      },
      {
        label: 'Required SGPA',
        data: [...Array(semesterData.length).fill(null), ...requiredSgpas],
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderColor: '#ff0000',
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `SGPA: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <Container>
      <h1>CGPA Tracker</h1>
      <ChartWrapper>
        <Bar data={chartData} options={chartOptions} />
      </ChartWrapper>
      <InfoWrapper>
        {targetCgpa !== null ? (
          <p>Current Target CGPA: {targetCgpa}</p>
        ) : (
          <p>Loading target CGPA...</p>
        )}
      </InfoWrapper>
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ChartWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const InfoWrapper = styled.div`
  margin: 20px 0;
  font-size: 16px;
  color: #333;
`;

export default Tracker;
