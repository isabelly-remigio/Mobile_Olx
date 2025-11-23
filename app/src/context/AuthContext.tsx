// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
}

interface DadosCadastro {
  nome: string;
  tipoConta: string;
  cpf: string;
  email: string;
  senha: string;
  endereco?: {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

interface AuthContextData {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  cadastrar: (dados: DadosCadastro) => Promise<void>;
  carregando: boolean;
  
  // Funções para gerenciar o fluxo de cadastro
  dadosCadastroTemporario: DadosCadastro | null;
  salvarDadosPessoais: (dados: Omit<DadosCadastro, 'endereco'>) => Promise<void>;
  salvarEndereco: (endereco: DadosCadastro['endereco']) => Promise<void>;
  limparDadosCadastro: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const STORAGE_KEY = 'dados_cadastro_temp';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [dadosCadastroTemporario, setDadosCadastroTemporario] = useState<DadosCadastro | null>(null);

  useEffect(() => {
    verificarLogin();
    carregarDadosCadastro();
  }, []);

  const carregarDadosCadastro = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
      if (dadosSalvos) {
        setDadosCadastroTemporario(JSON.parse(dadosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cadastro:', error);
    }
  };

  const verificarLogin = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem('usuario_logado');
      if (usuarioSalvo) {
        setUsuario(JSON.parse(usuarioSalvo));
      }
    } catch (error) {
      console.error('Erro ao verificar login:', error);
    } finally {
      setCarregando(false);
    }
  };

  const salvarDadosPessoais = async (dadosPessoais: Omit<DadosCadastro, 'endereco'>) => {
    try {
      const novosDados = {
        ...dadosPessoais,
        endereco: dadosCadastroTemporario?.endereco
      };
      setDadosCadastroTemporario(novosDados);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosDados));
    } catch (error) {
      console.error('Erro ao salvar dados pessoais:', error);
      throw error;
    }
  };

  const salvarEndereco = async (endereco: DadosCadastro['endereco']) => {
    try {
      if (!dadosCadastroTemporario) {
        throw new Error('Dados pessoais não encontrados');
      }

      const novosDados = {
        ...dadosCadastroTemporario,
        endereco
      };
      setDadosCadastroTemporario(novosDados);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosDados));
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      throw error;
    }
  };

  const limparDadosCadastro = async () => {
    try {
      setDadosCadastroTemporario(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados do cadastro:', error);
    }
  };

  const login = async (email: string, senha: string) => {
    setCarregando(true);
    try {
      const usuarioFake: Usuario = { id: '1', nome: 'Usuário', email };
      setUsuario(usuarioFake);
      await AsyncStorage.setItem('usuario_logado', JSON.stringify(usuarioFake));
    } finally {
      setCarregando(false);
    }
  };

  const cadastrar = async (dados: DadosCadastro) => {
    setCarregando(true);
    try {
      console.log('Dados para cadastro no back-end:', dados);
      
      const usuarioFake: Usuario = { 
        id: '1', 
        nome: dados.nome, 
        email: dados.email 
      };
      setUsuario(usuarioFake);
      await AsyncStorage.setItem('usuario_logado', JSON.stringify(usuarioFake));
      
      await limparDadosCadastro();
    } finally {
      setCarregando(false);
    }
  };

  const logout = async () => {
    setUsuario(null);
    await AsyncStorage.removeItem('usuario_logado');
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      cadastrar, 
      carregando,
      dadosCadastroTemporario,
      salvarDadosPessoais,
      salvarEndereco,
      limparDadosCadastro
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);