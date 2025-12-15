export const corrigirUrlImagem = (url: string): string => {
  if (!url) return 'https://via.placeholder.com/170x100?text=Sem+Imagem';
  
  // Remove espaços do nome do arquivo
  let urlCorrigida = url.trim();
  
  // Se for uma URL local com espaço no nome do arquivo
  if (urlCorrigida.includes(' ')) {
    // Codifica os espaços
    urlCorrigida = urlCorrigida.replace(/ /g, '%20');
  }
  
  // Verifica se é uma URL completa ou relativa
  if (!urlCorrigida.startsWith('http') && !urlCorrigida.startsWith('https')) {
    // Se começa com /, assume que é relativa ao backend
    if (urlCorrigida.startsWith('/')) {
      // Seu backend já tem /api na base, então não duplique
      urlCorrigida = `http://localhost:8080${urlCorrigida}`;
    }
  }
  
  return urlCorrigida;
};

export const extrairNomeArquivo = (url: string): string => {
  const partes = url.split('/');
  return partes[partes.length - 1] || 'imagem.jpg';
};

export const urlImagemValida = (url: string): boolean => {
  if (!url) return false;
  
  // Verifica se termina com extensão de imagem
  const extensoesValidas = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  const urlLower = url.toLowerCase();
  
  return extensoesValidas.some(ext => urlLower.endsWith(ext));
};