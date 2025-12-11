// services/usuarioService.ts
import { apiService } from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpfCnpj?: string;
  telefone?: string;
  dataNascimento?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    complemento?: string;
  };
  roles?: string[];
  possuiCredenciaisMercadoPago?: boolean;
}

export interface AtualizarUsuarioDTO {
  nome?: string;
  telefone?: string;
  dataNascimento?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  complemento?: string;
}

export const usuarioService = {
  // Buscar dados do usuário logado
  async buscarMeusDados(): Promise<Usuario> {
    try {
      console.log('👤 Buscando dados do usuário...');
      const response = await apiService.get('/usuarios/me');
      console.log('✅ Dados do usuário:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
      throw error;
    }
  },

  // Atualizar dados do usuário
  async atualizarMeusDados(dados: AtualizarUsuarioDTO): Promise<Usuario> {
    try {
      console.log('✏️ Atualizando dados do usuário:', dados);
      
      // Remove campos undefined/vazios
      const dadosLimpos = Object.fromEntries(
        Object.entries(dados).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      );
      
      console.log('📤 Dados enviados:', dadosLimpos);
      
      const response = await apiService.put('/usuarios/me', dadosLimpos);
      console.log('✅ Usuário atualizado:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  // Formatar telefone
  formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    
    const numeros = telefone.replace(/\D/g, '');
    
    if (numeros.length === 11) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
    } else if (numeros.length === 10) {
      return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;
    }
    
    return telefone;
  },

  // Formatar data de nascimento
  formatarDataNascimento(data: string): string {
    if (!data) return '';
    
    try {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    } catch {
      return data;
    }
  },

  // Obter iniciais do nome
  getIniciais(nome: string): string {
    if (!nome) return 'U';
    
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  },
};