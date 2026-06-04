import { useState } from 'react';
import ProductList from './components/ProductList';
import Signup from './components/Signup';
import Login from './components/Login';
import UploadProduct from './components/UploadProduct';

function App() {
  const [view, setView] = useState('list');
  const [token, setToken] = useState('');

  return (
    <div className="App">
      <nav style={{ padding: '10px', display: 'flex', gap: '10px', background: '#eee' }}>
        <button onClick={() => setView('list')}>Marketplace</button>
        <button onClick={() => setView('signup')}>Sign Up</button>
        <button onClick={() => setView('login')}>Login</button>
        {token && <button onClick={() => setView('upload')}>Upload</button>}
      </nav>

      <main style={{ padding: '20px' }}>
        {view === 'list' && <ProductList />}
        {view === 'signup' && <Signup />}
        {view === 'login' && <Login setToken={setToken} />}
        {view === 'upload' && token && <UploadProduct token={token} />}
      </main>
    </div>
  )
}

export default App
