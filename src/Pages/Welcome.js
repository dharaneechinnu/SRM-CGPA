import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('CGPA-User');

    if (!token) {
     
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>Welcome</div>
  );
}

export default Welcome;
