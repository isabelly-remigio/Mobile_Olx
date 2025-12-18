import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { FooterNavigationProps } from '../../@types/home';
import { FooterStyles } from '../../styles/components/FooterStyles';
import { theme } from '../../theme/theme';

const Footer = ({ ativo, onNavigate }: FooterNavigationProps) => {
  const router = useRouter();
  
  const itens = [
    { id: 'inicio', icone: 'home', texto: 'Início', rota: '/' },
    { id: 'explorar', icone: 'search', texto: 'Explorar', rota: '/(tabs)/explorar' },
    { id: 'favoritos', icone: 'favorite', texto: 'Favoritos', rota: '/(tabs)/favoritos' },
    { id: 'menu', icone: 'menu', texto: 'Menu', rota: '/(tabs)/menu' }
  ];
  
  const handleNavigate = (itemId: string, route: string) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
    router.push(route);
  };
  
  return (
    <View style={FooterStyles.container}>
      {itens.map((item) => {
        const isActive = ativo === item.id;
        const iconColor = isActive ? theme.colors.primary[500] : theme.colors.gray500;
        const textStyle = isActive ? FooterStyles.activeText : FooterStyles.inactiveText;
        
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleNavigate(item.id, item.rota)}
            style={FooterStyles.button}
            activeOpacity={0.7}
          >
            <Icon
              name={item.icone}
              type="material"
              size={24}
              color={iconColor}
              style={FooterStyles.icon}
            />
            <Text style={[FooterStyles.text, textStyle]}>
              {item.texto}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Footer;