import { apiService } from '@/app/src/services/api';
import { theme } from '@/app/src/theme/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetalhesCompra() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        // backend doesn't provide /pagamento/{id} — we fetch /pagamento/me and find the item
        const resp: any = await apiService.get('/pagamento/me');
        const list = Array.isArray(resp) ? resp : (resp?.items || []);
        const found = list.find((p: any) => String(p.id || p.pagamentoId || p.paymentId) === String(id));
        if (!found) throw new Error('Compra não encontrada');
        setData(found);
      } catch (err: any) {
        console.error('[DetalhesCompra] erro:', err);
        setError(err?.message || 'Erro ao carregar detalhes da compra');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const openUrl = async (url?: string) => {
    if (!url) return;
    try {
      if (Platform.OS === 'web') {
        window.location.href = url;
        return;
      }
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else Alert.alert('Erro', 'Não foi possível abrir a URL');
    } catch (err) {
      console.error('[DetalhesCompra] abrir URL erro:', err);
      Alert.alert('Erro', 'Não foi possível abrir a URL');
    }
  };

  if (loading) return (
    <SafeAreaView style={styles.containerCenter}>
      <ActivityIndicator size="large" color={theme.colors.primary[500]} />
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView style={styles.pad}>
      <Text style={{ color: theme.colors.error }}>{error}</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.button}><Text style={styles.buttonText}>Voltar</Text></TouchableOpacity>
    </SafeAreaView>
  );

  if (!data) return (
    <SafeAreaView style={styles.pad}>
      <Text>Nenhum dado encontrado.</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.button}><Text style={styles.buttonText}>Voltar</Text></TouchableOpacity>
    </SafeAreaView>
  );

  const pagamentoId = String(data.id || data.pagamentoId || data.paymentId || '');
  const status = String(data.status || data.statusPagamento || '');
  const amountCents = Number(data.amountCents ?? data.amount ?? 0);
  const total = (amountCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <SafeAreaView style={styles.pad}>
      <Text style={styles.title}>Detalhes da Compra</Text>
      <View style={styles.row}><Text style={styles.key}>ID:</Text><Text>{pagamentoId}</Text></View>
      <View style={styles.row}><Text style={styles.key}>Status:</Text><Text>{status}</Text></View>
      <View style={styles.row}><Text style={styles.key}>Total:</Text><Text>{total}</Text></View>

      {data.checkoutUrl ? (
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary[500], marginTop: 16 }]} onPress={() => openUrl(String(data.checkoutUrl))}>
          <Text style={styles.buttonText}>Abrir Checkout</Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity onPress={() => router.back()} style={[styles.button, { marginTop: 8 }]}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pad: { flex: 1, padding: 16, backgroundColor: theme.colors.white },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.white },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 8 },
  key: { fontWeight: '700', marginRight: 8 },
  button: { padding: 12, backgroundColor: theme.colors.gray100, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: theme.colors.black, fontWeight: '700' },
});
