import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Linking,
  ActivityIndicator
} from 'react-native';
import { Icon, Divider } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CarrosselAnuncio } from '@/app/src/components/ui/CarrosselAnuncio';
import { InfoAnunciante } from '@/app/src/components/ui/InfoAnunciante';
import { AcoesAnuncio } from '@/app/src/components/ui/AcoesAnuncio';
import { LocalizacaoAnuncio } from '@/app/src/components/ui/LocalizacaoAnuncio';
import { useCart } from '@/app/src/context/CartContext';
import { Anuncio } from '@/app/src/@types/anuncio';
import { anuncioService } from '@/app/src/services/anuncioService';
import styles from '@/app/src/styles/anuncio/DetalhesAnuncioStyles';

// Dados de fallback caso a API falhe
const dadosFallback: Anuncio = {
  id: '1',
  nome: 'Produto não disponível',
  preco: 0,
  anunciante: {
    nome: 'Vendedor',
    dataCadastro: '2022-03-15',
    regiao: 'Não informado',
    cidade: 'Não informada',
    estado: 'NI',
    tempoResposta: 'Não informado',
    emailVerificado: false,
    telefoneVerificado: false,
    telefone: ''
  },
  imagens: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&w=1080&q=80',
  ],
  descricao: 'Este produto não está disponível no momento.',
  detalhes: {
    condicao: 'Não informada'
  },
  localizacao: {
    bairro: 'Não informado',
    cidade: 'Não informada',
    estado: 'NI',
    cep: '00000-000'
  }
};

export default function DetalhesAnuncio() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favoritado, setFavoritado] = useState(false);
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      carregarAnuncio();
    } else {
      setErro('ID do anúncio não fornecido');
      setCarregando(false);
    }
  }, [id]);

  const carregarAnuncio = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      console.log(`📱 Carregando anúncio ID: ${id}`);
      const dados = await anuncioService.buscarPorId(id);
      setAnuncio(dados);
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar anúncio:', error);
      setErro(error.message || 'Erro ao carregar detalhes do anúncio');
      
      // Usa dados de fallback
      setAnuncio({
        ...dadosFallback,
        id: id || '0',
        nome: `Produto #${id}`,
        descricao: `Não foi possível carregar os detalhes deste produto. (${error.message})`
      });
      
    } finally {
      setCarregando(false);
    }
  };

  const formatarPreco = (valor: number) => {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const handleCompartilhar = () => {
    if (!anuncio) return;
    
    Alert.alert('Compartilhar', `Compartilhando: ${anuncio.nome}`);
    // Implementar lógica real de compartilhamento aqui
  };

  const handleAbrirPerfil = () => {
    if (!anuncio) return;
    
    Alert.alert('Perfil', `Abrindo perfil de ${anuncio.anunciante.nome}`);
    // router.push(`/perfil/${anuncio.anunciante.id}`);
  };

  const handleAdicionarCarrinho = () => {
    if (!anuncio) return;
    
    try {
      addToCart(anuncio);
      Alert.alert('Sucesso', `${anuncio.nome} adicionado ao carrinho!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar ao carrinho');
    }
  };

  const handleComprarAgora = () => {
    if (!anuncio) return;
    
    try {
      addToCart(anuncio);
      Alert.alert('Compra', `Iniciando compra de ${anuncio.nome}`);
      // router.push('/checkout');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a compra');
    }
  };

  const handleWhatsApp = () => {
    if (!anuncio || !anuncio.anunciante.telefone) {
      Alert.alert('Aviso', 'Telefone do vendedor não disponível');
      return;
    }
    
    const numero = anuncio.anunciante.telefone;
    const mensagem = encodeURIComponent(`Olá! Tenho interesse no anúncio: ${anuncio.nome}`);
    const url = `https://wa.me/${numero}?text=${mensagem}`;

    Linking.openURL(url).catch(err => {
      Alert.alert('Erro', 'Erro ao abrir WhatsApp: ' + err.message);
    });
  };

  const handleBack = () => {
    router.canGoBack() ? router.back() : router.replace("/");
  };

  const handleRecarregar = () => {
    carregarAnuncio();
  };

  // Tela de loading
  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
              >
                <Icon 
                  name="arrow-back" 
                  type="material" 
                  color="#374151"
                  size={24}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Carregando...</Text>
            </View>
          </View>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={{ marginTop: 10, color: '#6B7280' }}>
              Carregando detalhes do produto...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Tela de erro
  if (erro && !anuncio) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleBack}
              >
                <Icon 
                  name="arrow-back" 
                  type="material" 
                  color="#374151"
                  size={24}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Erro</Text>
            </View>
          </View>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Icon 
              name="error-outline" 
              type="material" 
              color="#EF4444"
              size={64}
            />
            <Text style={{ marginTop: 10, textAlign: 'center', color: '#EF4444' }}>
              {erro}
            </Text>
            <TouchableOpacity 
              style={{ 
                marginTop: 20, 
                padding: 10, 
                backgroundColor: '#3B82F6',
                borderRadius: 8
              }}
              onPress={handleRecarregar}
            >
              <Text style={{ color: 'white' }}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Se não tiver anúncio carregado
  if (!anuncio) {
    return null;
  }

  const descricaoLonga = anuncio.descricao.length > 150;
  const textoDescricao = descricaoExpandida || !descricaoLonga
    ? anuncio.descricao
    : anuncio.descricao.substring(0, 150) + '...';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Icon 
                name="arrow-back" 
                type="material" 
                color="#374151"
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Anúncio</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => setFavoritado(!favoritado)}
            >
              <Icon 
                name={favoritado ? 'favorite' : 'favorite-border'}
                type="material"
                color={favoritado ? '#EF4444' : '#374151'}
                size={24}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={handleCompartilhar}
            >
              <Icon 
                name="share" 
                type="material" 
                color="#374151"
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Carrossel */}
          <CarrosselAnuncio imagens={anuncio.imagens} />

          <View style={styles.content}>
            {/* Título e Preço */}
            <View style={styles.titleSection}>
              <Text style={styles.productName}>{anuncio.nome}</Text>
              <Text style={styles.price}>{formatarPreco(anuncio.preco)}</Text>
              <View style={styles.sellerInfo}>
                <Icon 
                  name="store" 
                  type="material" 
                  color="#6B7280"
                  size={16}
                />
                <Text style={styles.sellerName}>{anuncio.anunciante.nome}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Descrição */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.descriptionText}>{textoDescricao}</Text>
              {descricaoLonga && (
                <TouchableOpacity onPress={() => setDescricaoExpandida(!descricaoExpandida)}>
                  <Text style={styles.seeMoreText}>
                    {descricaoExpandida ? 'Ver menos' : 'Ver mais'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Detalhes do Produto */}
            {anuncio.detalhes && Object.keys(anuncio.detalhes).length > 0 && (
              <>
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
                  {Object.entries(anuncio.detalhes).map(([chave, valor]) => (
                    <View key={chave} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {chave.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                      </Text>
                      <Text style={styles.detailValue}>{String(valor)}</Text>
                    </View>
                  ))}
                </View>
                <Divider style={styles.divider} />
              </>
            )}

            {/* Localização */}
            {(anuncio.localizacao.cidade || anuncio.localizacao.estado) && (
              <>
                <LocalizacaoAnuncio
                  bairro={anuncio.localizacao.bairro}
                  cidade={anuncio.localizacao.cidade}
                  estado={anuncio.localizacao.estado}
                  cep={anuncio.localizacao.cep}
                />
                <Divider style={styles.divider} />
              </>
            )}

            {/* Informações do Anunciante */}
            <InfoAnunciante
              anunciante={anuncio.anunciante}
              onAbrirPerfil={handleAbrirPerfil}
            />

            {/* Dicas de Segurança */}
            <View style={styles.securityTips}>
              <View style={styles.securityHeader}>
                <Icon 
                  name="security" 
                  type="material" 
                  color="#92400E"
                  size={20}
                />
                <Text style={styles.securityTitle}>Dicas de Segurança</Text>
              </View>
              <View style={styles.securityTipsList}>
                <Text style={styles.securityTip}>
                  • Prefira se encontrar em locais públicos e movimentados
                </Text>
                <Text style={styles.securityTip}>
                  • Desconfie de preços muito abaixo do mercado
                </Text>
                <Text style={styles.securityTip}>
                  • Verifique a procedência do produto antes de comprar
                </Text>
              </View>
            </View>

            {/* Espaço para o botão fixo */}
            <View style={styles.spacer} />
          </View>
        </ScrollView>

        {/* Ações Fixas */}
        <AcoesAnuncio
          onWhatsApp={handleWhatsApp}
          onComprarAgora={handleComprarAgora}
          onAdicionarCarrinho={handleAdicionarCarrinho}
        />
      </SafeAreaView>
    </View>
  );
}