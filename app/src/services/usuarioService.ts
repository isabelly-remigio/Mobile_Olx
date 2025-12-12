// services/usuarioService.ts
import { apiService } from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpfCnpj?: string;
  telefone?: string;
  dataNascimento?: string;
  
  // ❌ REMOVA esta parte (não existe na API)
  // endereco?: {
  //   cep?: string;
  //   logradouro?: string;
  //   numero?: string;
  //   bairro?: string;
  //   cidade?: string;
  //   uf?: string;
  //   complemento?: string;
  // };
  
  // ✅ ADICIONE estas propriedades no nível raiz (igual a API)
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  complemento?: string;
  
  roles?: string[];
  possuiCredenciaisMercadoPago?: boolean;
}
// services/usuarioService.ts
export interface AtualizarUsuarioDTO {
  nome?: string;
  telefone?: string;
  dataNascimento?: string;
  // ✅ MUDAR: endereço no nível raiz
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  complemento?: string;
}

export const usuarioService = {
async buscarMeusDados(): Promise<Usuario> {
  try {
    let response;

    try {
      response = await apiService.get<Usuario>('/usuarios/me');
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        response = await apiService.get<Usuario>('/usuario/me');
      } else {
        throw error;
      }
    }

    return response; // <-- CORREÇÃO AQUI
  } catch (error) {
    throw error;
  }
},


async atualizarMeusDados(dados: AtualizarUsuarioDTO): Promise<Usuario> {
  try {
    const response = await apiService.put<Usuario>('/usuarios/me', dados);
    return response; // <-- CORREÇÃO AQUI
  } catch (error) {
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