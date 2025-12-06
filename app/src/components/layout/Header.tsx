import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  SafeAreaView,
  Platform 
} from 'react-native';
import { Icon } from '@rneui/themed';
import { HeaderProps } from '../../@types/home';
import styles from '../../styles/components/HeaderStyles';

const Header = ({ usuarioLogado, onToggleLogin, onNotificacoes }: HeaderProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={onToggleLogin}
        >
          <View style={styles.locationContent}>
            <Text style={styles.locationText} numberOfLines={1}>
              {usuarioLogado ? `Olá, ${usuarioLogado.nome}!` : 'Buscando em DDD 81 - Grande Recife'}
            </Text>
            <Icon 
              name="keyboard-arrow-down" 
              type="material" 
              color="#6B7280" // gray.500
              size={20}
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={onNotificacoes}
        >
          <Icon 
            name="notifications-outline" 
            type="ionicon" 
            color="#6B7280" // gray.500
            size={24}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;