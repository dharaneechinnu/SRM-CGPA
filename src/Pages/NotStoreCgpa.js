import React, { useState } from 'react';
import styled from 'styled-components';

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

const NotStoreCgpa = () => {
  const [courses, setCourses] = useState([{ credits: '', grade: '' }]);
  const [cgpa, setCgpa] = useState(null);

  // Handle adding new course input fields
  const handleAddCourse = () => {
    setCourses([...courses, { credits: '', grade: '' }]);
  };

  // Handle removing a course input field
  const handleRemoveCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  // Handle input changes
  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedCourses = [...courses];
    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
  };

  // Handle CGPA calculation
  const calculateCGPA = () => {
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
      const cgpaResult = totalPoints / totalCredits;
      setCgpa(cgpaResult.toFixed(2)); // Display CGPA with 2 decimal places
    } else {
      setCgpa(null);
    }
  };

  return (
    <Container>
      <Title>CGPA Calculator</Title>
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
        <CalculateButton onClick={calculateCGPA}>Calculate CGPA</CalculateButton>
      </ButtonGroup>
      {cgpa && (
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
  background-color: black;
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
  }
`;

const Title = styled.h2`
  font-family: 'Poppins', sans-serif;
  color: #fff;
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
    flex-direction: row; /* Stack vertically on smaller screens */
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
  color: #fff;
`;

export default NotStoreCgpa;
