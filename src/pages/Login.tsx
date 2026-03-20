import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Login = () => {
  const { setToken } = useBlog(); // permet de stocker le token dans le contexte
  const [username, setUsername] = useState(''); // par défaut 'admin'
  const [password, setPassword] = useState(''); // par défaut 'admin123'
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Appel à l'API Django pour récupérer le token
      const res = await fetch('http://127.0.0.1:8000/api-token-auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('Nom d’utilisateur ou mot de passe incorrect');
      }

      const data = await res.json();
      if (!data.token) throw new Error('Token non reçu depuis le backend');

      // Stocke le token dans le BlogContext
      setToken(data.token);

      // Redirige vers la page admin
      navigate('/admin');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-muted/20">
      <form
        className="bg-card p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold mb-4">Connexion Admin</h1>

        <label>Nom d’utilisateur</label>
        <Input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <label className="mt-4">Mot de passe</label>
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <Button type="submit" className="mt-6 w-full">
          Se connecter
        </Button>
      </form>
    </div>
  );
};

export default Login;
