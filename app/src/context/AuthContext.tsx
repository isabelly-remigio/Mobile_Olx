import React, { createContext, useContext, useState, useEffect } from 'react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
}

interface AuthContextData {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  cadastrar: (dados: any) => Promise<void>;
  carregando: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Verificar se usuário está logado (AsyncStorage)
    verificarLogin();
  }, []);

  const verificarLogin = async () => {
    // Lógica para verificar token no AsyncStorage
    setCarregando(false);
  };

  const login = async (email: string, senha: string) => {
    setCarregando(true);
    try {
      // Lógica de login
      const usuarioFake: Usuario = { id: '1', nome: 'Usuário', email };
      setUsuario(usuarioFake);
    } finally {
      setCarregando(false);
    }
  };

  const cadastrar = async (dados: any) => {
    setCarregando(true);
    try {
      // Lógica de cadastro
      const usuarioFake: Usuario = { 
        id: '1', 
        nome: dados.nome, 
        email: dados.email 
      };
      setUsuario(usuarioFake);
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    // Limpar AsyncStorage
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cadastrar, carregando }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);