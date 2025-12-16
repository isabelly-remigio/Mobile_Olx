import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, Linking, SafeAreaView, Text, View } from 'react-native';
import { useCart } from '../../src/context/CartContext';
import stripeService from '../../src/services/stripeService';

export default function Pagamento() {
	const router = useRouter();
	const { items, total, clearCart } = useCart();
	const [loading, setLoading] = useState(false);

	const handlePagar = async () => {
		if (items.length === 0) {
			Alert.alert('Carrinho vazio', 'Adicione itens ao carrinho antes de pagar.');
			return;
		}

		setLoading(true);
		try {
			// Envie os itens e demais dados ao backend para criar uma sessão de Checkout
			const payload = { items: items.map(i => ({ id: i.produto.id, quantidade: i.quantidade })) };
			const res = await stripeService.createCheckoutSession(payload);

			if (res?.url) {
				// Abra o Stripe Checkout hospedado
				await Linking.openURL(res.url);
				// Opcional: limpar o carrinho após redirecionamento
				clearCart();
			} else {
				throw new Error('Resposta inválida do servidor.');
			}
		} catch (error: any) {
			Alert.alert('Erro', error?.message || 'Não foi possível iniciar o pagamento.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, padding: 16 }}>
			<View style={{ marginBottom: 16 }}>
				<Text style={{ fontSize: 22, fontWeight: '600' }}>💳 Pagamento</Text>
				<Text style={{ marginTop: 8 }}>Total: R$ {total.toFixed(2)}</Text>
			</View>

			<FlatList
				data={items}
				keyExtractor={(item) => item.produto.id}
				renderItem={({ item }) => (
					<View style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
						<Text>{item.produto.titulo}</Text>
						<Text>Quantidade: {item.quantidade}</Text>
						<Text>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</Text>
					</View>
				)}
				ListEmptyComponent={() => (
					<View style={{ padding: 8 }}>
						<Text>Seu carrinho está vazio.</Text>
					</View>
				)}
			/>

			<View style={{ marginTop: 16 }}>
				{loading ? (
					<ActivityIndicator size="large" />
				) : (
					<Button title="Pagar" onPress={handlePagar} />
				)}
				<View style={{ height: 8 }} />
				<Button title="Voltar" onPress={() => router.back()} />
			</View>
		</SafeAreaView>
	);
}
