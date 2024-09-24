import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Api from '../Api/Api';

const StudentDashboard = () => {
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [expandedStudents, setExpandedStudents] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchStudents = async () => {
    try {
      const response = await Api.post(
        '/teacher/getstd',
        { year, section },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token for authorization
          },
        }
      );

      setStudents(response.data); // Assuming the response data is the list of students
      setError(''); // Clear any previous error
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'An error occurred while fetching students.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!year || !section) {
      setError('Please select both year and section.');
      return;
    }

    fetchStudents(); // Fetch students based on selected year and section
  };

  const toggleExpandStudent = (studentId) => {
    setExpandedStudents((prevExpanded) => ({
      ...prevExpanded,
      [studentId]: !prevExpanded[studentId],
    }));
  };

  const handleLogout = () => {
    // Logout functionality
    localStorage.clear(); // Clear local storage
    navigate('/login'); // Redirect to login page
  };

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.Reg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>Registered Students Dashboard</Header>

      {/* Logout Button */}
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>

      {/* Form for selecting year and section */}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Year:
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select Year</option>
              {[1, 2, 3, 4].map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              ))}
            </Select>
          </Label>

          <Label>
            Section:
            <Select value={section} onChange={(e) => setSection(e.target.value)}>
              <option value="">Select Section</option>
              {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((sectionOption) => (
                <option key={sectionOption} value={sectionOption}>
                  {sectionOption}
                </option>
              ))}
            </Select>
          </Label>
        </FormGroup>

        <Button type="submit">Fetch Students</Button>
      </Form>

      {/* Display Error Message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Search Input */}
      {students.length > 0 && (
        <SearchInput
          type="text"
          placeholder="Search by name or registration number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

      {/* Display Student List */}
      {filteredStudents.length > 0 && (
        <Table>
          <thead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Registration Number</TableHeader>
              <TableHeader>Date of Birth</TableHeader>
              <TableHeader>Gender</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>CGPA</TableHeader>
              <TableHeader>SGPA (Click to view)</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <React.Fragment key={student._id}>
                <TableRow>
                  <TableData>{student.name}</TableData>
                  <TableData>{student.Reg}</TableData>
                  <TableData>{new Date(student.dob).toLocaleDateString()}</TableData>
                  <TableData>{student.gender}</TableData>
                  <TableData>{student.email}</TableData>
                  <TableData>{student.cgpa}</TableData>
                  <TableData onClick={() => toggleExpandStudent(student._id)}>
                    {expandedStudents[student._id] ? 'Hide SGPA' : 'Show SGPA'}
                  </TableData>
                </TableRow>
                {expandedStudents[student._id] && (
                  <ExpandedRow>
                    <ExpandedData colSpan="7">
                      <SGPAList>
                        {student.sgpas &&
                          student.sgpas.map((sgpaEntry) => (
                            <SGPAItem key={sgpaEntry._id}>
                              <strong>Semester {sgpaEntry.semester}:</strong> {sgpaEntry.sgpa}
                            </SGPAItem>
                          ))}
                      </SGPAList>
                    </ExpandedData>
                  </ExpandedRow>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 30px;
  max-width: 1000px;
  margin: 50px auto;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  position: relative;
`;

const Header = styled.h1`
  text-align: center;
  color: #1f2937;
  font-size: 28px;
  font-weight: 600;
`;

const Form = styled.form`
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #f4f6f8;
`;

const FormGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  flex: 1;
`;

const Select = styled.select`
  padding: 12px;
  margin: 5px 0;
  border-radius: 5px;
  border: 1px solid #bbb;
  width: 100%;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px 30px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchInput = styled.input`
  padding: 12px;
  margin: 20px 0;
  border: 1px solid #bbb;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    outline: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.th`
  background-color: #007bff;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  position: sticky;
  top: 0;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const TableData = styled.td`
  padding: 15px;
`;

const ExpandedRow = styled.tr`
  background-color: #f9f9f9;
`;

const ExpandedData = styled.td`
  padding: 15px;
  text-align: left;
  colspan: 7; // Adjust according to the number of columns
`;

const SGPAList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SGPAItem = styled.li`
  padding: 5px 0;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #c82333;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default StudentDashboard;
