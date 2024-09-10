"use client"

import React, { useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'

const AdminLogin = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();


  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); 

    try {
      const response =  await axios.post('http://localhost:3001/admin/login', { mail, password });

      if (response.status === 200 && response.data.status) {
        localStorage.setItem('auth-token', response.headers['auth-token']);
        setSuccess('Login successful!');
        
        router.push('/admin/dashboard')
      } 
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleSubmit} className="admin-login-form dark:bg-white">
        <h2>Admin Login</h2>
        <div>
          <Label htmlFor="mail">Email:</Label>
          <Input
            type="email"
            id="mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
