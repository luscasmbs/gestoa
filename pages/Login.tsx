
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      const success = login(username.trim(), password.trim());
      if (!success) {
        setError('Nome de usuário ou senha inválidos.');
      }
    } else {
        setError('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-light to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Project Gestão</h1>
          <p className="mt-2 text-text-secondary">Faça login para acessar seus projetos</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <label htmlFor="username" className="sr-only">Nome de Usuário</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border bg-white placeholder-gray-400 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Seu nome (ex: Lucas)"
              />
            </div>
             <div>
              <label htmlFor="password-login" className="sr-only">Senha</label>
              <input
                id="password-login"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border bg-white placeholder-gray-400 text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
            </div>
          </div>

          {error && <p className="text-sm text-danger text-center">{error}</p>}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
