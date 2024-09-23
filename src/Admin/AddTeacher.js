import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Api from '../Api/Api';

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    mail: '',
    dob: '',
    gender: '',
    year: '',
    section: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post('/admin/regTeacher', formData);
      if (response.status === 200) {
        setSuccess('Teacher registered successfully!');
        setFormData({
          name: '',
          password: '',
          mail: '',
          dob: '',
          gender: '',
          year: '',
          section: '',
        });
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during teacher registration:', error);
      setError('An error occurred during registration');
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Add Teacher</Title>
        {error && <Error>{error}</Error>}
        {success && <Success>{success}</Success>}
        
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="mail"
          placeholder="Email"
          value={formData.mail}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        <Select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        
        <Select name="year" value={formData.year} onChange={handleChange} required>
          <option value="">Select Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </Select>
        
        <Select name="section" value={formData.section} onChange={handleChange} required>
          <option value="">Select Section</option>
          {Array.from({ length: 26 }, (_, i) => (
            <option key={i} value={String.fromCharCode(65 + i)}>
               {String.fromCharCode(65 + i)} {/* A to Z */}
            </option>
          ))}
        </Select>
        
        <Button type="submit">Register Teacher</Button>
      </Form>
    </FormContainer>
  );
};

// Styled components (same as before)
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: white;
`;

const Form = styled.form`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
`;

const Success = styled.p`
  color: green;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;
`;

export default AddTeacher;
