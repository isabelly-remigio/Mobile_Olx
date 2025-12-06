import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Linking
} from 'react-native';
import { Icon, Divider } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CarrosselAnuncio } from '@/app/src/components/ui/CarrosselAnuncio';
import { InfoAnunciante } from '@/app/src/components/ui/InfoAnunciante';
import { AcoesAnuncio } from '@/app/src/components/ui/AcoesAnuncio';
import { LocalizacaoAnuncio } from '@/app/src/components/ui/LocalizacaoAnuncio';
import { useCart } from '@/app/src/context/CartContext';
import { Anuncio } from '@/app/src/@types/anuncio';
import styles from '@/app/src/styles/anuncio/DetalhesAnuncioStyles';

// Dados mockados
const dadosAnuncio: Anuncio = {
  id: '1',
  nome: 'iPhone 13 Pro Max 256GB',
  preco: 4500.00,
  anunciante: {
    nome: 'TechStore Recife',
    dataCadastro: '2022-03-15',
    regiao: 'Boa Viagem',
    cidade: 'Recife',
    estado: 'PE',
    tempoResposta: '2 horas',
    emailVerificado: true,
    telefoneVerificado: true,
    telefone: '5581987398754'
  },
  imagens: [
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&w=1080&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=170&h=100&fit=crop',
    'https://images.unsplash.com/photo-1612832021047-9f3f1b6b5f4c?auto=format&w=1080&q=80',
  ],
  descricao: 'iPhone 13 Pro Max em excelente estado de conservação AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  detalhes: {
    cor: 'Grafite',
    condicao: 'Usado',
    marca: 'Apple',
    modelo: 'iPhone 13 Pro Max',
    armazenamento: '256GB',
    memoria: '6GB RAM'
  },
  localizacao: {
    bairro: 'Boa Viagem',
    cidade: 'Recife',
    estado: 'PE',
    cep: '51020-000'
  }
};

export default function DetalhesAnuncio() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favoritado, setFavoritado] = useState(false);
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);
  const { addToCart } = useCart();
  
  const anuncio = dadosAnuncio; // substituir pela busca real

  const formatarPreco = (valor: number) => {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const descricaoLonga = anuncio.descricao.length > 150;
  const textoDescricao = descricaoExpandida || !descricaoLonga
    ? anuncio.descricao
    : anuncio.descricao.substring(0, 150) + '...';

  const handleCompartilhar = () => {
    Alert.alert('Compartilhar', 'Compartilhando anúncio...');
  };

  const handleAbrirPerfil = () => {
    Alert.alert('Perfil', `Abrindo perfil de ${anuncio.anunciante.nome}`);
  };

  const handleAdicionarCarrinho = () => {
    try {
      addToCart(anuncio);
      Alert.alert('Sucesso', `${anuncio.nome} adicionado ao carrinho!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar ao carrinho');
    }
  };

  const handleComprarAgora = () => {
    try {
      addToCart(anuncio);
      Alert.alert('Compra', `Iniciando compra de ${anuncio.nome}`);
      // router.push('/checkout');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a compra');
    }
  };

  const handleWhatsApp = () => {
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
                color="#374151" // gray.700
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
                color={favoritado ? '#EF4444' : '#374151'} // red.500 : gray.700
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
                color="#374151" // gray.700
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
                  color="#6B7280" // gray.500
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
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
              {Object.entries(anuncio.detalhes).map(([chave, valor]) => (
                <View key={chave} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {chave.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <Text style={styles.detailValue}>{valor}</Text>
                </View>
              ))}
            </View>

            <Divider style={styles.divider} />

            {/* Localização */}
            <LocalizacaoAnuncio
              bairro={anuncio.localizacao.bairro}
              cidade={anuncio.localizacao.cidade}
              estado={anuncio.localizacao.estado}
              cep={anuncio.localizacao.cep}
            />

            <Divider style={styles.divider} />

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
                  color="#92400E" // yellow.700
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