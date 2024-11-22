"use client";

import React from 'react';
import { Button } from '@mui/material';

const SuccessPage: React.FC = () => {

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Form Submission Successful!</h1>
      <p>Thank you for submitting the form. We have received your information.</p>
    </div>
  );
};

export default SuccessPage;