import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api';
import { useNavigate } from 'react-router-dom';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTeachers = async () => {
    try {
      const response = await Api.get('/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to fetch teachers');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await Api.delete(`/teachers/${id}`);
        fetchTeachers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting teacher:', error);
        setError('Failed to delete teacher');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-teacher/${id}`); // Navigate to the edit form
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <Container>
      <Title>Teacher List</Title>
      {error && <Error>{error}</Error>}
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Date of Birth</Th>
            <Th>Gender</Th>
            <Th>Year</Th>
            <Th>Section</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <tr key={teacher._id}>
                <Td>{teacher.name}</Td>
                <Td>{teacher.email}</Td>
                <Td>{new Date(teacher.dob).toLocaleDateString()}</Td>
                <Td>{teacher.gender}</Td>
                <Td>{teacher.year}</Td>
                <Td>{teacher.section}</Td>
                <Td>
                  <Button onClick={() => handleEdit(teacher._id)}>Edit</Button>
                  <Button onClick={() => handleDelete(teacher._id)}>Delete</Button>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan="7">No teachers found</Td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  background: #f9f9f9;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Error = styled.p`
  color: red;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const Th = styled.th`
  padding: 10px;
  background: #007bff;
  color: white;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export default TeacherList;
