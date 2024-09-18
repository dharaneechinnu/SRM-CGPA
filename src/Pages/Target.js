import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Api from '../Api/Api'; // Ensure you have the Api module for API calls'
import styled from 'styled-components';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Target = () => {
  const [semesterData, setSemesterData] = useState([]);
  const [targetCgpa, setTargetCgpa] = useState('');
  const [isTargetSet, setIsTargetSet] = useState(false);
  const userid = localStorage.getItem("CGPA-User");

  // Parse the data from localStorage and access the 'Reg' field
  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;

  // Fetch semester data from the backend
  useEffect(() => {
    const fetchSemesterData = async () => {
      try {
        const response = await Api.get(`/api/sgpa/${reg}`); // Replace YOUR_REG_NUMBER with actual reg number or dynamic value
        if (response.status === 200) {
          const data = response.data.sgpas || []; // Ensure sgpas is an array
          setSemesterData(data);
        } else {
          console.error('Failed to fetch semester data:', response.status);
          setSemesterData([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error('Error fetching semester data:', error);
        setSemesterData([]); // Fallback to an empty array
      }
    };

    fetchSemesterData();
  }, [reg]);

  const handleTargetChange = (e) => {
    setTargetCgpa(e.target.value);
  };

  const handleSetTarget = async () => {
    try {
      const response = await Api.post('/api/set-target', { targetCgpa,reg });
      if (response.status === 200) {
        setIsTargetSet(true);
        alert('Target CGPA set successfully');
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
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: '#007bff',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
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
      <h1>Target CGPA</h1>
      <ChartWrapper>
        <Bar data={chartData} options={chartOptions} />
      </ChartWrapper>
      <InputWrapper>
        <h2>Set Target CGPA</h2>
        <input
          type="number"
          value={targetCgpa}
          onChange={handleTargetChange}
          placeholder="Enter target CGPA"
          step="0.01"
        />
        <button onClick={handleSetTarget}>Set Target</button>
        {isTargetSet && <p>Target CGPA set to {targetCgpa}</p>}
      </InputWrapper>
    </Container>
  );
};

// Styled components for responsiveness
const Container = styled.div`
  text-align: center;
  padding: 20px;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ChartWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  input {
    margin-bottom: 10px;
    padding: 10px;
    width: 80%;
    max-width: 300px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #0056b3;
    }
  }

  p {
    margin-top: 10px;
    font-size: 16px;
    color: #333;
  }
`;

export default Target;
