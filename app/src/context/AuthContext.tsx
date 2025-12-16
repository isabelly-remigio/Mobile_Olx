import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  savePersonalData: (data: PersonalData) => void;
  personalData: PersonalData | null;
  isAuthenticated: boolean;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  verificationLoading: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;

}

interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string;
}

interface PersonalData {
  nome: string;
  email: string;
  senha: string;
  cpfCnpj: string;
  telefone: string;
  dataNascimento: string;
}

interface RegisterData extends PersonalData {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_URL = 'https://olxmarketplace.duckdns.org/api'; //BASE URL DA API
  const [verificationLoading, setVerificationLoading] = useState(false);

  const verifyEmail = async (email: string, code: string) => {
    setVerificationLoading(true);
    try {
      console.log('Verificando email:', { email, code });

      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          code: code.trim()
        }),
      });

      const data = await response.json();
      console.log('Resposta da verificação:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Código de verificação inválido');
      }

      return data;
    } catch (error: any) {
      console.error('Erro na verificação:', error);
      throw error;
    } finally {
      setVerificationLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    setVerificationLoading(true);
    try {
      console.log('Reenviando verificação para:', email);

      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim()
        }),
      });

      const data = await response.json();
      console.log('Resposta do reenvio:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao reenviar verificação');
      }

      return data;
    } catch (error: any) {
      console.error('Erro no reenvio:', error);
      throw error;
    } finally {
      setVerificationLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/esqueci-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao solicitar redefinição de senha');
      }

      return { success: true, message: data.message || 'E-mail enviado com sucesso' };

    } catch (error: any) {
      return { success: false, message: error.message || 'Erro desconhecido' };
    } finally {
      setLoading(false);
    }
  };


  // Função para lidar com erros da API
  const handleApiError = async (response: Response) => {
    const data = await response.json();
    const errorMessage = data.message || data.error || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  };

  const savePersonalData = (data: PersonalData) => {
    setPersonalData(data);
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      console.log('🚀 [API REGISTER] Iniciando chamada para API...');
      console.log('📡 [API REGISTER] URL:', `${API_URL}/auth/register/comprador`);

      // Preparar dados para envio
      const dadosParaEnvio = {
        nome: userData.nome.trim(),
        email: userData.email.toLowerCase().trim(),
        senha: userData.senha,
        cpfCnpj: userData.cpfCnpj.replace(/\D/g, ''),
        telefone: userData.telefone.replace(/\D/g, ''),
        dataNascimento: userData.dataNascimento,
        cep: userData.cep.replace(/\D/g, ''),
        logradouro: userData.logradouro.trim(),
        numero: userData.numero.trim(),
        bairro: userData.bairro.trim(),
        cidade: userData.cidade.trim(),
        uf: userData.uf.trim().toUpperCase(),
        complemento: userData.complemento?.trim() || ''
      };

      console.log('📦 [API REGISTER] Dados enviados para API:', {
        ...dadosParaEnvio,
        senha: '***',
        cpfCnpj: dadosParaEnvio.cpfCnpj.substring(0, 3) + '...',
        telefone: dadosParaEnvio.telefone.substring(0, 4) + '...'
      });

      const response = await fetch(`${API_URL}/auth/register/comprador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dadosParaEnvio),
      });

      console.log('📨 [API REGISTER] Status da resposta:', response.status);
      console.log('📨 [API REGISTER] Status OK?', response.ok);

      // Tentar ler a resposta como texto primeiro para debug
      const responseText = await response.text();
      console.log('📨 [API REGISTER] Resposta bruta:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📨 [API REGISTER] Resposta JSON:', data);
      } catch (e) {
        console.error('❌ [API REGISTER] Erro ao fazer parse da resposta:', e);
        throw new Error('Resposta inválida da API');
      }

      if (!response.ok) {
        console.error('❌ [API REGISTER] Erro na resposta:', data);
        throw new Error(data.message || data.error || `Erro ${response.status}: ${response.statusText}`);
      }

      console.log('✅ [API REGISTER] Registro bem-sucedido!');
      console.log('🔑 [API REGISTER] Token recebido?', !!data.token);
      console.log('👤 [API REGISTER] Dados do usuário:', data.user || data);

      // Se houver token, salvar e autenticar o usuário
      if (data.token) {
        const userData = {
          id: data.user?.id || data.id || Date.now().toString(),
          nome: data.user?.nome || dadosParaEnvio.nome,
          email: data.user?.email || dadosParaEnvio.email,
          telefone: data.user?.telefone || dadosParaEnvio.telefone,
          dataNascimento: data.user?.dataNascimento || dadosParaEnvio.dataNascimento,
        };

        console.log('💾 [API REGISTER] Salvando no AsyncStorage...');
        await AsyncStorage.setItem('@Auth:token', data.token);
        await AsyncStorage.setItem('auth_token', data.token); // ← ADICIONE ESTA LINHA!

        await AsyncStorage.setItem('@Auth:user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ [API REGISTER] Usuário salvo e autenticado!');
      } else {
        console.log('⚠️ [API REGISTER] Nenhum token recebido na resposta');
      }

      // Limpar dados temporários
      setPersonalData(null);
      console.log('🧹 [API REGISTER] Dados temporários limpos');

      return data;
    } catch (error: any) {
      console.error('❌ [API REGISTER] Erro completo:', error);
      console.error('❌ [API REGISTER] Mensagem:', error.message);
      console.error('❌ [API REGISTER] Stack:', error.stack);

      // Melhorar mensagens de erro
      if (error.message.includes('email') || error.message.includes('Email')) {
        throw new Error('Este email já está em uso. Tente outro ou faça login.');
      } else if (error.message.includes('cpf') || error.message.includes('CPF')) {
        throw new Error('CPF/CNPJ já cadastrado. Verifique os dados ou faça login.');
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        throw new Error(error.message || 'Não foi possível completar o cadastro. Tente novamente.');
      }
    } finally {
      setLoading(false);
      console.log('🏁 [API REGISTER] Registro finalizado');
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Tentando login com:', {
        email: email.toLowerCase().trim(),
        senha: '***'
      });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          senha: password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Resposta do login COMPLETA:', data);

      if (data.token) {
        const nome =
          data.nomeUsuario ||
          data.nome ||
          data.name ||
          email.split('@')[0];

        const userData = {
          id: data.user?.id || data.id || Date.now().toString(),
          nome: nome,
          email: email,
          telefone: data.telefone,
          dataNascimento: data.dataNascimento,
        };

        console.log('UserData salvo:', userData);

        // 🔧 MUDANÇA AQUI: Salvar em DOIS locais
        await AsyncStorage.setItem('@Auth:token', data.token);
        await AsyncStorage.setItem('auth_token', data.token); // ← ADICIONE ESTA LINHA!
        await AsyncStorage.setItem('@Auth:user', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        // Verificar se salvou corretamente (debug)
        const token1 = await AsyncStorage.getItem('@Auth:token');
        const token2 = await AsyncStorage.getItem('auth_token');
        console.log('✅ Tokens salvos:', {
          '@Auth:token': token1 ? '✅' : '❌',
          'auth_token': token2 ? '✅' : '❌',
          'São iguais?': token1 === token2
        });

        return data;
      } else {
        throw new Error('Token não recebido na resposta');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      // ... restante do código
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => {
    try {
      // 🔧 MUDANÇA AQUI: Remover de TODOS os locais
      await AsyncStorage.multiRemove([
        '@Auth:token',
        '@Auth:user',
        'auth_token'  // ← ADICIONE ESTE!
      ]);
      setUser(null);
      setIsAuthenticated(false);
      setPersonalData(null);
      console.log('✅ Logout completo - tokens removidos de todos os locais');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Verificar se usuário está logado ao iniciar
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const token = await AsyncStorage.getItem('@Auth:token');
        const userJson = await AsyncStorage.getItem('@Auth:user');

        if (token && userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Usuário restaurado do storage:', userData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do storage:', error);
      }
    };

    loadStorageData();
  }, []);

  const updateUser = async (userData: Partial<User>) => {
    try {
      console.log('🔄 Atualizando usuário no contexto:', userData);

      if (user) {
        // Atualiza o estado local
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);

        // Atualiza o AsyncStorage
        await AsyncStorage.setItem('@Auth:user', JSON.stringify(updatedUser));

        console.log('✅ Usuário atualizado no contexto:', updatedUser);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário no contexto:', error);
    }
  };

  // Adicione ao retorno do contexto:
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      register,
      updateUser, // ← ADICIONE AQUI
      savePersonalData,
      personalData,
      isAuthenticated,
      verificationLoading,
      verifyEmail,
      resendVerification,
    }}>
      {children}
    </AuthContext.Provider>
  );

}