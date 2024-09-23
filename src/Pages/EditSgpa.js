import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Api from '../Api/Api'; // Import your API module

const EditSgpa = () => {
  const [sgpaList, setSgpaList] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userid = localStorage.getItem("CGPA-User");
  const parsedUser = JSON.parse(userid);
  const reg = parsedUser?.user?.Reg;
console.log(reg)
  // Fetch SGPA data for all semesters
  const fetchSgpa = async () => {
    try {
      const response = await Api.get(`/api/sgpas/${reg}`);
      if (response.status === 200) {
        setSgpaList(response.data.sgpas || []); // Ensure it's an array
        console.log(response.data.sgpas || [])
      } else {
        setError('Failed to fetch SGPA');
      }
    } catch (err) {
      setError('Error fetching SGPA');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSgpa();
  }, []);

  // Handle input change for editing SGPA
  const handleChange = (index, event) => {
    const updatedSgpaList = [...sgpaList];
    updatedSgpaList[index].sgpa = event.target.value;
    setSgpaList(updatedSgpaList);
  };

  // Save updated SGPA and recalculate CGPA
  const saveSgpa = async () => {
    try {
      const response = await Api.put(`/api/sgpa/update`, { sgpaList, reg });
      if (response.status === 200) {
        alert('SGPA updated successfully!');
        fetchSgpa(); // Optionally refetch the updated SGPA list
      } else {
        alert('Failed to update SGPA');
      }
    } catch (err) {
      console.error('Error updating SGPA:', err);
      alert('Error updating SGPA');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <h2>Edit SGPA</h2>
      {sgpaList && sgpaList.length === 0 ? (
        <p>No SGPA data available</p>
      ) : (
        sgpaList.map((sgpaData, index) => (
          <SgpaInput key={index}>
            <label>Semester {sgpaData.semester}:</label>
            <input
              type="number"
              value={sgpaData.sgpa}
              onChange={(e) => handleChange(index, e)}
              min="0"
              max="10"
              step="0.01"
            />
          </SgpaInput>
        ))
      )}
      <Button onClick={saveSgpa}>Save SGPA</Button>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
`;

const SgpaInput = styled.div`
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    padding: 8px;
    width: 100px;
    text-align: center;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #1eaaf1;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0d8bd7;
  }
`;

export default EditSgpa;
