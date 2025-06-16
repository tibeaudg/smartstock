
import React from 'react';
import { Header } from './Header';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  return <Header onLoginClick={handleLoginClick} />;
};
