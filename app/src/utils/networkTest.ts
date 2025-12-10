import { apiService } from '../services/api';

export const testBackendConnection = async () => {
  try {
    // Tente uma rota pública primeiro
    const response = await fetch('http://192.168.1.100:8080/api/health');
    if (response.ok) {
      console.log('✅ Backend está acessível');
      return true;
    }
  } catch (error) {
    console.log('❌ Não foi possível acessar o backend:', error);
    
    // Sugestões para o usuário
    const suggestions = [
      '1. Verifique se o backend está rodando',
      '2. Verifique se o IP está correto',
      '3. Verifique se há firewall bloqueando',
      '4. Tente usar localhost:8080 se estiver no emulador'
    ];
    
    console.log(suggestions.join('\n'));
    return false;
  }
};