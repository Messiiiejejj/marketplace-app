import { useEffect, useState } from 'react';

interface Product {
  product_id: number;
  title: string;
  description: string;
  price: number;
  public_location: string;
}

const API_URL = 'https://marketplace-app-ivtr.onrender.com';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading amazing items for you...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Discover Products</h2>
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '3rem', background: '#fff', padding: '2rem', borderRadius: '1rem' }}>
          <h3>Welcome to our Marketplace!</h3>
          <p>It looks like there are no products listed yet. Be the first to start the trend!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {products.map((p) => (
            <div key={p.product_id} style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '0.75rem', background: '#fff' }}>
              <h3>{p.title}</h3>
              <p style={{ color: '#6b7280' }}>{p.description}</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>${p.price}</p>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Location: {p.public_location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
