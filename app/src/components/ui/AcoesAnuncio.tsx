// components/ui/AcoesAnuncio.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext'; // Mude para useCart
import { 
  AcoesAnuncioStyles, 
  AcoesAnuncioColors, 
  AcoesAnuncioIconSizes,
  AcoesAnuncioOpacity 
} from '../../styles/components/AcoesAnuncioStyles';
import { AcoesAnuncioProps } from '../../@types/anuncio';

export const AcoesAnuncio: React.FC<AcoesAnuncioProps> = ({
  onWhatsApp,
  onComprarAgora,
  onAdicionarCarrinho,
  // Novas props opcionais
  produtoId,
  quantidade = 1,
  onAdicionarCarrinhoSuccess,
  onAdicionarCarrinhoError,
}) => {
  const router = useRouter();
  const { addToCart, loading: carrinhoLoading } = useCart(); // Mude para useCart
  const [localLoading, setLocalLoading] = useState(false);

  const isLoading = carrinhoLoading || localLoading;

  // Adicionar ao carrinho com feedback
  const handleAdicionarCarrinho = async () => {
    // Se já tiver uma função personalizada, use-a (compatibilidade com código antigo)
    if (onAdicionarCarrinho) {
      onAdicionarCarrinho();
      return;
    }

    // Nova lógica com integração à API
    if (!produtoId || isNaN(Number(produtoId))) {
      const errorMsg = 'Produto inválido';
      onAdicionarCarrinhoError?.(errorMsg);
      Alert.alert('Erro', errorMsg);
      return;
    }

    try {
      setLocalLoading(true);
      
      await addToCart(Number(produtoId), quantidade);
      
      onAdicionarCarrinhoSuccess?.();
      
      // Feedback visual
      Alert.alert(
        'Sucesso!',
        'Produto adicionado ao carrinho',
        [
          {
            text: 'Continuar comprando',
            style: 'cancel',
          },
          {
            text: 'Ver carrinho',
            onPress: () => router.push('/(tabs)/carrinho'),
          },
        ]
      );
    } catch (error: any) {
      const errorMsg = error.message || 'Erro ao adicionar ao carrinho';
      onAdicionarCarrinhoError?.(errorMsg);
    } finally {
      setLocalLoading(false);
    }
  };

  // Comprar agora
  const handleComprarAgora = async () => {
    // Se já tiver uma função personalizada, use-a
    if (onComprarAgora) {
      onComprarAgora();
      return;
    }

    // Nova lógica com integração à API
    if (!produtoId || isNaN(Number(produtoId))) {
      Alert.alert('Erro', 'Produto inválido');
      return;
    }

    try {
      setLocalLoading(true);
      
      // Primeiro adiciona ao carrinho
      const resultado = await addToCart(Number(produtoId), quantidade);
      
      if (resultado) {
        // Depois vai para o checkout
        Alert.alert(
          'Compra Rápida',
          'Produto adicionado ao carrinho! Deseja ir para o checkout?',
          [
            {
              text: 'Continuar comprando',
              style: 'cancel',
            },
            // {
            //   text: 'Ir para checkout',
            //   onPress: () => router.push('/'),
            // },
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar ao carrinho');
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível realizar a compra');
    } finally {
      setLocalLoading(false);
    }
  };

  // WhatsApp
  const handleWhatsApp = () => {
    if (onWhatsApp) {
      onWhatsApp();
      return;
    }

    Alert.alert(
      'Contato WhatsApp',
      'Deseja entrar em contato com o vendedor?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            // Implemente a lógica de WhatsApp aqui
            console.log('Abrir WhatsApp');
          },
        },
      ]
    );
  };

  return (
    <View style={AcoesAnuncioStyles.container}>
      <View style={AcoesAnuncioStyles.buttonRow}>
        {/* Botão Carrinho */}
        <TouchableOpacity
          style={[
            AcoesAnuncioStyles.touchableButton, 
            AcoesAnuncioStyles.carrinhoTouchable,
            isLoading && AcoesAnuncioStyles.disabledButton
          ]}
          onPress={handleAdicionarCarrinho}
          activeOpacity={AcoesAnuncioOpacity.active}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator 
              size="small" 
              color={AcoesAnuncioColors.primary} 
              style={AcoesAnuncioStyles.touchableIcon}
            />
          ) : (
            <MaterialIcons 
              name="add-shopping-cart" 
              size={AcoesAnuncioIconSizes.small} 
              color={AcoesAnuncioColors.primary} 
              style={AcoesAnuncioStyles.touchableIcon}
            />
          )}
          <Text style={AcoesAnuncioStyles.carrinhoTouchableText}>
            {isLoading ? 'Adicionando...' : 'Carrinho'}
          </Text>
        </TouchableOpacity>

        {/* Botão Comprar */}
        <TouchableOpacity
          style={[
            AcoesAnuncioStyles.touchableButton, 
            AcoesAnuncioStyles.comprarTouchable,
            isLoading && AcoesAnuncioStyles.disabledButton
          ]}
          onPress={handleComprarAgora}
          activeOpacity={AcoesAnuncioOpacity.active}
          disabled={isLoading}
        >
          <MaterialIcons 
            name="shopping-cart" 
            size={AcoesAnuncioIconSizes.small} 
            color={AcoesAnuncioColors.white} 
            style={AcoesAnuncioStyles.touchableIcon}
          />
          <Text style={AcoesAnuncioStyles.comprarTouchableText}>
            Comprar
          </Text>
        </TouchableOpacity>

        {/* Botão WhatsApp */}
        <TouchableOpacity
          style={AcoesAnuncioStyles.whatsappTouchable}
          onPress={handleWhatsApp}
          activeOpacity={AcoesAnuncioOpacity.active}
        >
          <FontAwesome 
            name="whatsapp" 
            size={AcoesAnuncioIconSizes.large} 
            color={AcoesAnuncioColors.whatsapp} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};