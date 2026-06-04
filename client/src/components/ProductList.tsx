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
    fetch(`${API_URL}/products`) // Need to ensure this endpoint exists on backend
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

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <h2>Marketplace Products</h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {products.map((p) => (
          <div key={p.product_id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>Price: ${p.price}</p>
            <p>Location: {p.public_location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
