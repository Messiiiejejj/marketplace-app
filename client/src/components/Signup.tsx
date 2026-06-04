import { useState } from 'react';

const API_URL = 'https://marketplace-app-ivtr.onrender.com';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consumer');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Signing up...');
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Sign up successful! Please check your email.');
      } else {
        setMessage(`Error: ${data.message || 'Signup failed'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error, please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Join our Marketplace</h2>
      <p>Create an account to buy or sell items.</p>
      {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="consumer">Consumer</option>
        <option value="business">Business</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
}
