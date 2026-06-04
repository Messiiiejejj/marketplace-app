import { useState } from 'react';

const API_URL = 'https://marketplace-app-ivtr.onrender.com';

export default function UploadProduct({ token }: { token: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/products/upload`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title, description, price, type: 'fixed' }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Product</h2>
      <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} required />
      <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} required />
      <button type="submit">Upload</button>
    </form>
  );
}
