import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api';

const ResumeUpload = () => {
  const [courseName, setCourseName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [uploadedCertificates, setUploadedCertificates] = useState([]);
  const [currentPage, setCurrentPage] = useState('upload');
  const [editMode, setEditMode] = useState(false);
  const [editCert, setEditCert] = useState(null);
  const userid = localStorage.getItem("CGPA-User");

  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;

  useEffect(() => {
    if (currentPage === 'show') {
      const fetchCertificates = async () => {
        try {
          if (!reg) {
            console.error('Registration number is not defined.');
            return;
          }

          const response = await Api.get(`/api/resume/${reg}`);
          setUploadedCertificates(response.data.certificates || []);
        } catch (error) {
          console.error('Error fetching certificates:', error);
        }
      };

      fetchCertificates();
    }
  }, [currentPage, reg]);

  const handleUrlChange = (event) => setCertificateUrl(event.target.value);
  const handleCourseNameChange = (event) => setCourseName(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!certificateUrl || !courseName) {
      alert('Please enter a URL and course name.');
      return;
    }

    try {
      if (editMode) {
        const response = await Api.put(`/api/edit-Resume/${editCert._id}`, { courseName, certificateUrl, reg });
        alert('resume updated successfully!');
        setEditMode(false);
        setEditCert(null);
      } else {
        const response = await Api.post('/api/upload-Resume', { courseName, certificateUrl, reg });
        alert('resume link submitted successfully!');
      }
      
      setCourseName('');
      setCertificateUrl('');
      setCurrentPage('show');
    } catch (error) {
      console.error('Error submitting certificate:', error);
      alert('Error submitting certificate. Please try again.');
    }
  };

  const handleEditClick = (cert) => {
    setEditCert(cert);
    setCourseName(cert.courseName);
    setCertificateUrl(cert.certificateUrl);
    setEditMode(true);
    setCurrentPage('upload');
  };

  const handleUploadClick = () => setCurrentPage('upload');
  const handleShowClick = () => setCurrentPage('show');

  return (
    <Container>
      <ButtonContainer>
        <NavButton onClick={handleUploadClick} active={currentPage === 'upload'}>
          {editMode ? 'Edit Resume' : 'Upload resume'}
        </NavButton>
        <NavButton onClick={handleShowClick} active={currentPage === 'show'}>
          Show resume
        </NavButton>
      </ButtonContainer>

      {currentPage === 'upload' ? (
        <>
          <Title>{editMode ? 'Edit Resume Link' : 'Submit Resume Link'}</Title>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
              Resume Name based on company:
                <Input
                  type="text"
                  value={courseName}
                  onChange={handleCourseNameChange}
                  required
                />
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>
                Resume URL:
                <Input
                  type="text"
                  value={certificateUrl}
                  onChange={handleUrlChange}
                  required
                />
              </Label>
            </FormGroup>
            <SubmitButton type="submit">
              {editMode ? 'Update' : 'Submit'}
            </SubmitButton>
          </Form>
        </>
      ) : (
        <>
          <SectionTitle>Resume Certificates</SectionTitle>
          <CertificatesTable>
            <thead>
              <TableRow>
                <TableHeader>Resume Name</TableHeader>
                <TableHeader>Resume Link</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {uploadedCertificates.map((cert, index) => (
                <TableRow key={index}>
                  <TableData>{cert.courseName}</TableData>
                  <TableData>
                    <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                      View Certificate
                    </a>
                  </TableData>
                  <TableData>
                    <EditButton onClick={() => handleEditClick(cert)}>Edit</EditButton>
                  </TableData>
                </TableRow>
              ))}
            </tbody>
          </CertificatesTable>
        </>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  width: 100%;
  max-width: 500px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 16px;
`;

const Input = styled.input`
  margin-top: 5px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
`;

const CertificatesTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #f4f4f4;
  text-align: left;
`;

const TableData = styled.td`
  padding: 10px;
`;

const ButtonContainer = styled.div`
  margin-bottom: 20px;
`;

const NavButton = styled.button`
  background-color: ${(props) => (props.active ? '#007bff' : '#6c757d')};
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;

  &:hover {
    background-color: ${(props) => (props.active ? '#0056b3' : '#5a6268')};
  }
`;

const EditButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

export default ResumeUpload;
