import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native';
import { Icon } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import styles from '@/app/src/styles/Verificacao/TelaAcesseContaStyles';

const TelaAcesseConta = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // PEGANDO O EMAIL

  const voltar = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={voltar}
          >
            <Icon 
              name="arrow-back" 
              type="material" 
              color="rgba(0, 0, 0, 0.7)" 
              size={24}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>
            Acesse sua conta
          </Text>
          
          <View style={styles.headerPlaceholder} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        {/* Envelope */}
        <View style={styles.envelopeContainer}>
          <View style={styles.envelopeCircle}>
            <View style={styles.envelope}>
              <View style={styles.envelopeFlap} />
            </View>
            
            <View style={styles.checkCircle}>
              <Icon 
                name="check" 
                type="material" 
                color="#FFFFFF" 
                size={14}
              />
            </View>
          </View>
        </View>

        <Text style={styles.title}>
          Verifique seu e-mail
        </Text>

        <Text style={styles.subtitle}>
          Siga as instruções enviadas para:
        </Text>

        <View style={styles.emailContainer}>
          <View style={styles.avatar}>
            <Icon 
              name="person" 
              type="material" 
              color="#FFFFFF" 
              size={16}
            />
          </View>
          <Text style={styles.emailText}>
            {email || 'Seu email'}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Icon
            name="mail-outline"
            type="ionicon"
            color="#757575"
            size={20}
          />
          <Text style={styles.infoText}>
            Caso não tenha encontrado o e-mail, verifique sua caixa de Spam.
          </Text>
        </View>

        <View style={styles.spacer} />
      </View>
    </View>
  );
};

export default TelaAcesseConta;
