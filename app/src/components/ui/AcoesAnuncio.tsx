// components/ui/AcoesAnuncioTouchable.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AcoesAnuncioProps } from '../../@types/anuncio';
import { 
  AcoesAnuncioStyles, 
  AcoesAnuncioColors, 
  AcoesAnuncioIconSizes,
  AcoesAnuncioOpacity 
} from '../../styles/components/AcoesAnuncioStyles';

export const AcoesAnuncio: React.FC<AcoesAnuncioProps> = ({
  onWhatsApp,
  onComprarAgora,
  onAdicionarCarrinho,
}) => {
  return (
    <View style={AcoesAnuncioStyles.container}>
      <View style={AcoesAnuncioStyles.buttonRow}>
        {/* Botão Carrinho */}
        <TouchableOpacity
          style={[AcoesAnuncioStyles.touchableButton, AcoesAnuncioStyles.carrinhoTouchable]}
          onPress={onAdicionarCarrinho}
          activeOpacity={AcoesAnuncioOpacity.active}
        >
          <MaterialIcons 
            name="add-shopping-cart" 
            size={AcoesAnuncioIconSizes.small} 
            color={AcoesAnuncioColors.primary} 
            style={AcoesAnuncioStyles.touchableIcon}
          />
          <Text style={AcoesAnuncioStyles.carrinhoTouchableText}>Carrinho</Text>
        </TouchableOpacity>

        {/* Botão Comprar */}
        <TouchableOpacity
          style={[AcoesAnuncioStyles.touchableButton, AcoesAnuncioStyles.comprarTouchable]}
          onPress={onComprarAgora}
          activeOpacity={AcoesAnuncioOpacity.active}
        >
          <MaterialIcons 
            name="shopping-cart" 
            size={AcoesAnuncioIconSizes.small} 
            color={AcoesAnuncioColors.white} 
            style={AcoesAnuncioStyles.touchableIcon}
          />
          <Text style={AcoesAnuncioStyles.comprarTouchableText}>Comprar</Text>
        </TouchableOpacity>

        {/* Botão WhatsApp */}
        <TouchableOpacity
          style={AcoesAnuncioStyles.whatsappTouchable}
          onPress={onWhatsApp}
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