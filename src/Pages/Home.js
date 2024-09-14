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

const CGPACalculator = () => {
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
      if (!isNaN(credits) && grade !== undefined) {
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
  width: 50%;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-family: 'Poppins', sans-serif;
  color: #333;
  margin-bottom: 20px;
`;

const CourseInput = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  gap: 10px;
`;

const Input = styled.input`
  width: 100px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;

  &:focus {
    border-color: #1eaaf1;
    outline: none;
  }
`;

const Select = styled.select`
  width: 120px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:focus {
    border-color: #1eaaf1;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 10px;
`;

const AddButton = styled.button`
  background-color: #1eaaf1;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0d8bd7;
  }
`;

const CalculateButton = styled(AddButton)`
  margin-left: 10px;
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
  font-size: 20px;
  color: #333;
`;

export default CGPACalculator;
