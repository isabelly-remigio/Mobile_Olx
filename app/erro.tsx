import { Icon } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function PaginaErro() {
  const router = useRouter();
  const localParams = useLocalSearchParams() as Record<string, any>;
  const error = (typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('error')
    : undefined) || localParams.error;

  const session_id = (typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('session_id')
    : undefined) || localParams.session_id || localParams.sessionId;

  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtoNome, setProdutoNome] = useState<string | null>(null);

  useEffect(() => {
    const qpProdutoId = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search).get('produtoId') : undefined;
    const qpProdutoNome = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search).get('produtoNome') : undefined;

    if (qpProdutoId) setProdutoId(Number(qpProdutoId));
    if (qpProdutoNome) setProdutoNome(qpProdutoNome);

    if (localParams.produtoId) setProdutoId(Number(localParams.produtoId));
    if (localParams.produtoNome) setProdutoNome(localParams.produtoNome);
  }, [session_id, localParams]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView style={{ padding: 16, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.replace('/') } style={{ marginRight: 12 }}>
            <Icon name="arrow-back" type="material" size={26} color="#374151" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '600' }}>Pagamento não concluído</Text>
        </View>

        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Icon name="error-outline" type="material" size={80} color="#EF4444" />
          <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20 }}>O pagamento não foi concluído.</Text>
          {error && (
            <Text style={{ marginTop: 12, color: '#6B7280' }}>{String(error)}</Text>
          )}

          {(produtoNome || produtoId) && (
            <Text style={{ marginTop: 12, color: '#6B7280' }}>{produtoNome ? `${produtoNome} (ID: ${produtoId ?? '—'})` : `Produto ID: ${produtoId}`}</Text>
          )}

          <View style={{ marginTop: 32, width: '100%' }}>
            <TouchableOpacity onPress={() => router.replace('/')} style={{ backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>Tentar novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/compras')} style={{ marginTop: 12, padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' }}>
              <Text style={{ color: '#374151', fontWeight: '600' }}>Ver compras</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
