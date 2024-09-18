import React, { useState } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api'; // Import your API module

// Grade to point mapping
const gradeToPoint = {
  O: 10,
  'A+': 9,
  A: 8,
  'B+': 7,
  B: 6,
  C: 5,
  F: 0,
};

const CalCpga = () => {
  const [courses, setCourses] = useState([{ credits: '', grade: '' }]);
  const [cgpa, setCgpa] = useState(null);
  const [semester, setSemester] = useState('');
  const [sgpa, setSgpa] = useState(null);

  // Handle adding new course input fields
  const handleAddCourse = () => {
    setCourses([...courses, { credits: '', grade: '' }]);
  };

  // Handle removing a course input field
  const handleRemoveCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const userid = localStorage.getItem("CGPA-User");
  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;

  // Handle input changes
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedCourses = [...courses];
    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
  };

  // Handle SGPA calculation
  const calculateSGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const credits = parseFloat(course.credits);
      const grade = gradeToPoint[course.grade]; // Convert grade to points using the mapping
      if (!isNaN(credits) && credits >= 0 && grade !== undefined) {
        totalPoints += credits * grade;
        totalCredits += credits;
      }
    });

    if (totalCredits > 0) {
      const sgpaResult = totalPoints / totalCredits;
      setSgpa(sgpaResult.toFixed(2)); // Display SGPA with 2 decimal places
      // Save SGPA to backend
      saveSGPA(sgpaResult);
    } else {
      setSgpa(null);
    }
  };

 
  const saveSGPA = async (sgpa) => {
    try {
      const response = await Api.post('/api/sgpa', { semester, sgpa, reg }); 
      if (response.status === 201) {
        alert(response.data.message);
      }
       else {
        fetchCGPA();
      }
    } catch (error) {
        alert(error);
      console.error('Error saving SGPA:', error);
    }
  };

 
  const fetchCGPA = async () => {
    try {
      const reg = parsedUser?.user?.Reg; // Ensure this is defined correctly
      const response = await Api.get(`/api/cgpa/${reg}`); // Correctly include reg in the URL
  
      if (response.status === 200) {
        setCgpa(response.data.cgpa.toFixed(2)); // Use response.data to access the actual data
      } else {
        console.error('Failed to fetch CGPA:', response.status);
      }
    } catch (error) {
      console.error('Error fetching CGPA:', error);
    }
  };
  

  return (
    <Container>
      <Title>SGPA Calculator</Title>
      <SelectSemester
        name="semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      >
        <option value="">Select Semester</option>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
          <option key={sem} value={sem}>Semester {sem}</option>
        ))}
      </SelectSemester>
      {courses.map((course, index) => (
        <CourseInput key={index}>
          <Input
            type="number"
            name="credits"
            placeholder="Credits"
            value={course.credits}
            onChange={e => handleChange(index, e)}
            min="0"
          />
          <Select
            name="grade"
            value={course.grade}
            onChange={e => handleChange(index, e)}
          >
            <option value="">Select Grade</option>
            {Object.keys(gradeToPoint).map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </Select>
          <RemoveButton onClick={() => handleRemoveCourse(index)}>Remove</RemoveButton>
        </CourseInput>
      ))}
      <ButtonGroup>
        <AddButton onClick={handleAddCourse}>Add Course</AddButton>
        <CalculateButton onClick={calculateSGPA}>Calculate SGPA</CalculateButton>
      </ButtonGroup>
      {sgpa && (
        <Result>
          Your SGPA is: <strong>{sgpa}</strong>
        </Result>
      )}
      {cgpa !== null && (
        <Result>
          Your CGPA is: <strong>{cgpa}</strong>
        </Result>
      )}
    </Container>
  );
};

// Styled-components for styling

const Container = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  color: black;
  border-radius: 10px;
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
  }
`;

const Title = styled.h2`
  font-family: 'Poppins', sans-serif;
  color: black;
  margin-bottom: 20px;
  font-size: 1.8rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CourseInput = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center; /* Center horizontally on large screens */
  max-width: 100%; /* Ensure it does not overflow */
  
  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on smaller screens */
    align-items: center; /* Center horizontally on smaller screens */
  }
`;

const Input = styled.input`
  width: 100%;
  max-width: 150px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;

  &:focus {
    border-color: #1eaaf1;
    outline: none;
  }

  @media (max-width: 768px) {
    max-width: 120px;
  }
`;

const Select = styled.select`
  width: 100%;
  max-width: 160px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:focus {
    border-color: #1eaaf1;
    outline: none;
  }

  @media (max-width: 768px) {
    max-width: 130px;
  }
`;

const SelectSemester = styled.select`
  width: 100%;
  max-width: 200px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;

  &:focus {
    border-color: #1eaaf1;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const AddButton = styled.button`
  background-color: #1eaaf1;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0d8bd7;
  }
`;

const CalculateButton = styled(AddButton)`
  margin-top: 10px;
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const Result = styled.div`
  margin-top: 20px;
  font-size: 1.2rem;
  color: black;
`;

export default CalCpga;
