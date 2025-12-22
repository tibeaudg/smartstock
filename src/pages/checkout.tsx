import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Checkout page is no longer needed - redirect to signup
export default function CheckoutPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to signup since platform is completely free
    navigate('/auth?mode=register');
  }, [navigate]);
  
  return null;
}
