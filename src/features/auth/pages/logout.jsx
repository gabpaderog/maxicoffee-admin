import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Before logout:', localStorage.getItem('accessToken'));
    localStorage.removeItem('accessToken');
    console.log('After logout:', localStorage.getItem('accessToken'));
    navigate('/signin');
  }, []);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;