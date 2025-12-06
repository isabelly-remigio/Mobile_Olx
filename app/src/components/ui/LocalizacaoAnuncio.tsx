// components/ui/LocalizacaoAnuncio.tsx
import React from 'react';
import { View } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { Localizacao } from '../../@types/anuncio';
import { LocalizacaoAnuncioStyles } from '../../styles/components/LocalizacaoAnuncioStyles';
import { theme } from '../../theme/theme';

export const LocalizacaoAnuncio: React.FC<Localizacao> = ({ 
  bairro, 
  cidade, 
  estado, 
  cep 
}) => {
  return (
    <View style={LocalizacaoAnuncioStyles.container}>
      <Text style={LocalizacaoAnuncioStyles.title}>Localização</Text>
      <View style={LocalizacaoAnuncioStyles.locationContainer}>
        <Icon
          name="location-on"
          type="material"
          size={20}
          color={theme.colors.primary[500]} // Usando a cor primária do tema
        />
        <View style={LocalizacaoAnuncioStyles.textContainer}>
          <Text style={LocalizacaoAnuncioStyles.neighborhood}>{bairro}</Text>
          <Text style={LocalizacaoAnuncioStyles.cityState}>
            {cidade} - {estado}
          </Text>
          <Text style={LocalizacaoAnuncioStyles.cep}>CEP: {cep}</Text>
        </View>
      </View>
    </View>
  );
};