import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api';
import male from '../Assest/male.jpg';
import female from '../Assest/female.jpg';

const Home = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const userid = localStorage.getItem("CGPA-User");

  // Parse the data from localStorage and access the 'Reg' field
  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;

  // Fetch student details based on registration number
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await Api.get(`/api/student/${reg}`);
        if (response.status === 200) {
          setStudent(response.data);
          setFormData(response.data); // Initialize formData with fetched student data
        } else {
          console.error('Failed to fetch student details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    if (reg) {
      fetchStudentDetails();
    }
  }, [reg]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('CGPA-User');
    window.location.href = '/login'; // Redirect to login page
  };

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleSaveChanges = async () => {
    try {
      console.log("Saving changes with data:", formData); // Log form data for debugging
      const response = await Api.put(`/api/student/${reg}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        setStudent(formData);
        setIsEditing(false);
        alert('Changes saved successfully');
      } else {
        console.error('Failed to save changes:', response.status, response.statusText);
        alert('Failed to save changes. Please try again.');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
  };
  
// Handle form input changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
  console.log(  setFormData({ ...formData, [name]: value }))
};


  if (!student) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  // Format the date of birth
  const formattedDOB = new Date(student.dob).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Choose the image based on gender
  const genderImage = student.gender === 'male' ? male : female;

  return (
    <DashboardContainer>
      <TopButtonsWrapper>
        <EditButton onClick={handleEdit}>Edit</EditButton>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </TopButtonsWrapper>
      <Title>Student Dashboard</Title>
      <ProfileSection>
        <ProfileImage src={genderImage} alt="Profile" />
        <InfoSection>
          <InfoDetails>{student.name}</InfoDetails>
          <InfoDetails>{student.Reg}</InfoDetails>
          <InfoDetails>{formattedDOB}</InfoDetails>
          {isEditing ? (
            <>
              <Input name="current_sem" value={formData.current_sem || ''} onChange={handleInputChange} />
              <Input name="mobileNo" value={formData.mobileNo || ''} onChange={handleInputChange} />
              <Input name="address" value={formData.address || ''} onChange={handleInputChange} />
              <Input name="parentAddress" value={formData.parentAddress || ''} onChange={handleInputChange} />
            </>
          ) : null}
        </InfoSection>
        {isEditing && (
          <SaveButton onClick={handleSaveChanges}>Save Changes</SaveButton>
        )}
      </ProfileSection>
      <ContentSection>
        <Card>
          <CardTitle>Personal Information</CardTitle>
          <InfoItem>
            <InfoTitle>Email Id:</InfoTitle>
            <InfoDetail>{student.email}</InfoDetail>
          </InfoItem>
          <InfoItem>
            <InfoTitle>Mobile No:</InfoTitle>
            {isEditing ? (
              <Input name="mobileNo" value={formData.mobileNo || ''} onChange={handleInputChange} />
            ) : (
              <InfoDetail>{student.mobileNo || 'N/A'}</InfoDetail>
            )}
          </InfoItem>
          <InfoItem>
            <InfoTitle>Address:</InfoTitle>
            {isEditing ? (
              <Input name="address" value={formData.address || ''} onChange={handleInputChange} />
            ) : (
              <InfoDetail>{student.address || 'N/A'}</InfoDetail>
            )}
          </InfoItem>
          <InfoItem>
            <InfoTitle>Parent Address:</InfoTitle>
            {isEditing ? (
              <Input name="parentAddress" value={formData.parentAddress || ''} onChange={handleInputChange} />
            ) : (
              <InfoDetail>{student.parentAddress || 'N/A'}</InfoDetail>
            )}
          </InfoItem>
        </Card>
        <Card>
          <CardTitle>Academic Information</CardTitle>
          <InfoItem>
            <InfoTitle>Current Semester:</InfoTitle>
            {isEditing ? (
              <Input name="current_sem" value={formData.current_sem || ''} onChange={handleInputChange} />
            ) : (
              <InfoDetail>{student.current_sem}</InfoDetail>
            )}
          </InfoItem>
          <InfoItem>
            <InfoTitle>CGPA:</InfoTitle>
            <InfoDetail>{student.cgpa.toFixed(2)}</InfoDetail>
          </InfoItem>
          <InfoItem>
            <InfoTitle>Required CGPA:</InfoTitle>
            <InfoDetail>{student.targetCgpa || 'N/A'}</InfoDetail>
          </InfoItem>
        </Card>
      </ContentSection>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: black;
  border-radius: 8px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const TopButtonsWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #218838;
  }
`;

const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #c82333;
  }
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 2rem;
  text-align: center;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
  flex-wrap: wrap;
  gap: 20px;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ccc;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 600;
  text-align: left;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  gap: 20px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5rem;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const InfoTitle = styled.span`
  font-weight: bold;
`;

const InfoDetail = styled.span`
  color: #555;
`;

const InfoDetails = styled.span`
font-size: 2.5rem;
  color: black;
`;
const Input = styled.input`
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
  margin: 5px 0;
`;

const SaveButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #555;
`;

export default Home;
