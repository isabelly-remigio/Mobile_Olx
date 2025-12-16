// components/ui/InfoAnunciante.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { Anunciante } from '../../@types/anuncio';
import { InfoAnuncianteStyles } from '../../styles/components/InfoAnuncianteStyles';
import { theme } from '../../theme/theme';
interface InfoAnuncianteProps {
  anunciante: Anunciante;
  onAbrirPerfil: () => void;
}

export const InfoAnunciante: React.FC<InfoAnuncianteProps> = ({ anunciante, onAbrirPerfil }) => {
  const formatarDataCadastro = (data: Date | string) => {
    const ano = new Date(data).getFullYear();
    return `Membro desde ${ano}`;
  };

  return (
    <View style={InfoAnuncianteStyles.container}>
      <Text style={InfoAnuncianteStyles.title}>Sobre o Anunciante</Text>
      
      <View style={InfoAnuncianteStyles.anuncianteContainer}>
        <View style={InfoAnuncianteStyles.avatar}>
          <Text style={InfoAnuncianteStyles.avatarText}>
            {anunciante.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={InfoAnuncianteStyles.infoContainer}>
          <Text style={InfoAnuncianteStyles.nome}>{anunciante.nome}</Text>
          <Text style={InfoAnuncianteStyles.dataCadastro}>
            {formatarDataCadastro(anunciante.dataCadastro)}
          </Text>
        </View>
      </View>

      <View style={InfoAnuncianteStyles.badgesContainer}>
        {anunciante.emailVerificado && (
          <View style={[InfoAnuncianteStyles.badge, InfoAnuncianteStyles.emailBadge]}>
            <MaterialIcons
              name="check-circle"
              size={12}
              color="#047857"
            />
            <Text style={[InfoAnuncianteStyles.badgeText, InfoAnuncianteStyles.emailBadgeText]}>
              E-mail verificado
            </Text>
          </View>
        )}
        
        {anunciante.telefoneVerificado && (
          <View style={[InfoAnuncianteStyles.badge, InfoAnuncianteStyles.telefoneBadge]}>
            <MaterialIcons
              name="check-circle"
              size={12}
              color="#1E40AF"
            />
            <Text style={[InfoAnuncianteStyles.badgeText, InfoAnuncianteStyles.telefoneBadgeText]}>
              Telefone verificado
            </Text>
          </View>
        )}
      </View>

      <View style={{ gap: theme.spacing.sm }}>
        <View style={InfoAnuncianteStyles.infoRow}>
          <MaterialIcons
            name="location-on"
            size={16}
            color={theme.colors.gray600}
          />
          <Text style={InfoAnuncianteStyles.infoText}>
            {anunciante.regiao}, {anunciante.cidade} - {anunciante.estado}
          </Text>
        </View>
        
        <View style={InfoAnuncianteStyles.infoRow}>
          <MaterialIcons
            name="access-time"
            size={16}
            color={theme.colors.gray600}
          />
          <Text style={InfoAnuncianteStyles.infoText}>
            Responde em cerca de {anunciante.tempoResposta}
          </Text>
        </View>
      </View>

    
    </View>
  );
};