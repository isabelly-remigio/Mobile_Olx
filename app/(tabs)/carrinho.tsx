// app/(tabs)/carrinho.tsx
import { CheckBox, Icon } from '@rneui/themed';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import stripeService from '../src/services/stripeService';
import { theme } from '../src/theme/theme';
import { formatarPreco } from '../src/utils/formatters';

// Tipos
interface ItemCarrinho {
    id: string;
    imagem: string;
    nome: string;
    preco: number;
    quantidade: number;
    disponivel: boolean;
    selecionado: boolean;
}

interface ResumoPedido {
    subtotal: number;
    frete: number;
    total: number;
    quantidadeSelecionada: number;
}

const Carrinho = () => {
    const navegacao = useNavigation();
    const router = useRouter();

    // Estado inicial com itens de exemplo
    const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([
        {
            id: '1',
            imagem: 'https://images.unsplash.com/photo-1525547719578-795b3c2edcee?w=400',
            nome: 'Notebook Lenovo IdeaPad 3',
            preco: 2300.00,
            quantidade: 1,
            disponivel: true,
            selecionado: true,
        },
        {
            id: '2',
            imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            nome: 'Fone Bluetooth JBL Tune 510BT',
            preco: 90.00,
            quantidade: 2,
            disponivel: true,
            selecionado: true,
        },
        {
            id: '3',
            imagem: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
            nome: 'Mouse Logitech MX Master 3',
            preco: 299.90,
            quantidade: 1,
            disponivel: true,
            selecionado: true,
        },
    ]);

    const [selecionarTudo, setSelecionarTudo] = useState(true);
    const [estaLogado] = useState(true); // Simulação de login

    // Configurar header
    useEffect(() => {
        navegacao.setOptions({
            headerTitle: () => (
                <View style={estilos.headerContainer}>
                    <TouchableOpacity
                        style={estilos.checkboxHeader}
                        onPress={alternarSelecionarTudo}
                        activeOpacity={0.7}
                    >
                        <CheckBox
                            checked={selecionarTudo}
                            onPress={alternarSelecionarTudo}
                            checkedColor={theme.colors.primary[500]}
                            uncheckedColor={theme.colors.gray300}
                        />

                        <Text style={estilos.tituloHeader}>
                            Carrinho ({itensCarrinho.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            ),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: theme.colors.white,
            },
            headerTintColor: theme.colors.black,
            headerShadowVisible: true,
        });
    }, [navegacao, selecionarTudo, itensCarrinho.length]);

    // Calcular resumo do pedido apenas dos itens selecionados
    const calcularResumo = (): ResumoPedido => {
        const itensSelecionados = itensCarrinho.filter(item => item.selecionado);

        const subtotal = itensSelecionados.reduce(
            (total, item) => total + (item.preco * item.quantidade),
            0
        );

        // Frete fixo de R$ 20,00 para exemplo
        const frete = subtotal > 0 ? 20.00 : 0;

        return {
            subtotal,
            frete,
            total: subtotal + frete,
            quantidadeSelecionada: itensSelecionados.length,
        };
    };

    const resumo = calcularResumo();

    // Alternar seleção de um item específico
    const alternarSelecaoItem = (id: string) => {
        setItensCarrinho(prevItens =>
            prevItens.map(item =>
                item.id === id ? { ...item, selecionado: !item.selecionado } : item
            )
        );
    };

    // Alternar selecionar tudo
    const alternarSelecionarTudo = () => {
        const novoEstado = !selecionarTudo;
        setSelecionarTudo(novoEstado);

        setItensCarrinho(prevItens =>
            prevItens.map(item => ({ ...item, selecionado: novoEstado }))
        );
    };

    // Atualizar quantidade de um item
    const atualizarQuantidade = (id: string, novaQuantidade: number) => {
        if (novaQuantidade < 1) return;

        setItensCarrinho(prevItens =>
            prevItens.map(item =>
                item.id === id ? { ...item, quantidade: novaQuantidade } : item
            )
        );
    };

    // Remover item do carrinho - CORRIGIDO
    const removerItem = (id: string) => {
        Alert.alert(
            'Remover item',
            'Tem certeza que deseja remover este item do carrinho?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        const novosItens = itensCarrinho.filter(item => item.id !== id);
                        setItensCarrinho(novosItens);
                    },
                },
            ]
        );
    };

    // Remover itens selecionados
    const removerSelecionados = () => {
        const itensSelecionados = itensCarrinho.filter(item => item.selecionado);

        if (itensSelecionados.length === 0) {
            Alert.alert('Nenhum item selecionado', 'Selecione itens para remover.');
            return;
        }

        Alert.alert(
            'Remover itens selecionados',
            `Deseja remover ${itensSelecionados.length} item(ns) do carrinho?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        const novosItens = itensCarrinho.filter(item => !item.selecionado);
                        setItensCarrinho(novosItens);
                    },
                },
            ]
        );
    };

    // Navegar para produtos
    const navegarParaProdutos = () => {
        router.push('/(tabs)/explorar');
    };

    // Navegar para login
    const navegarParaLogin = () => {
        router.push('/auth/Login/login');
    };

    // Finalizar compra apenas dos itens selecionados
    const finalizarCompra = () => {
        if (!estaLogado) {
            navegarParaLogin();
            return;
        }

        const itensSelecionados = itensCarrinho.filter(item => item.selecionado);

        if (itensSelecionados.length === 0) {
            Alert.alert('Nenhum item selecionado', 'Selecione itens para comprar.');
            return;
        }

            // Pergunta de confirmação antes de iniciar o checkout
            Alert.alert(
                'Finalizar Compra',
                `Total do pedido (${itensSelecionados.length} itens): ${formatarPreco(resumo.total)}`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Confirmar', onPress: async () => await iniciarCheckout(itensSelecionados) },
                ]
            );
    };

        const [estaCarregandoCheckout, setEstaCarregandoCheckout] = React.useState(false);

        const iniciarCheckout = async (itensSelecionados: ItemCarrinho[]) => {
            setEstaCarregandoCheckout(true);
            try {
                const payload = {
                    items: itensSelecionados.map(i => ({ id: i.id, quantidade: i.quantidade, nome: i.nome, preco: i.preco }))
                };

                const res = await stripeService.createCheckoutSession(payload);

                if (res?.url) {
                    // Logar a URL do checkout para depuração
                    console.log('Stripe Checkout URL:', res.url);

                    // Abra o Stripe Checkout hospedado
                    await Linking.openURL(res.url);

                    // Remover os itens comprados do carrinho localmente
                    const novosItens = itensCarrinho.filter(item => !item.selecionado);
                    setItensCarrinho(novosItens);
                    setSelecionarTudo(false);
                } else {
                    Alert.alert('Erro', 'Resposta inválida do servidor ao iniciar o pagamento.');
                }
            } catch (error: any) {
                Alert.alert('Erro', error?.message || 'Não foi possível iniciar o pagamento.');
            } finally {
                setEstaCarregandoCheckout(false);
            }
        };

        // PaymentSheet (nativo) foi removido; usamos apenas o Checkout hospedado.


    // Renderizar item do carrinho
    const renderizarItem = ({ item }: { item: ItemCarrinho }) => (
        <View style={estilos.itemCarrinho}>
            <CheckBox
                checked={item.selecionado}
                onPress={() => alternarSelecaoItem(item.id)}
                checkedColor={theme.colors.primary[500]}
                uncheckedColor={theme.colors.gray300}
                containerStyle={estilos.checkboxItem}
            />

            <Image
                source={{ uri: item.imagem }}
                style={estilos.imagemProduto}
            />

            <View style={estilos.infoProduto}>
                <Text style={estilos.nomeProduto} numberOfLines={2}>
                    {item.nome}
                </Text>
                <Text style={estilos.precoProduto}>
                    {formatarPreco(item.preco)}
                </Text>

                <View style={estilos.controlesItem}>
                    <View style={estilos.controleQuantidade}>
                        <TouchableOpacity
                            style={estilos.botaoQuantidade}
                            onPress={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                            disabled={item.quantidade <= 1}
                        >
                            <Icon
                                name="minus"
                                type="material-community"
                                size={14}
                                color={item.quantidade <= 1 ? theme.colors.gray300 : theme.colors.black}
                            />
                        </TouchableOpacity>

                        <Text style={estilos.textoQuantidade}>
                            {item.quantidade}
                        </Text>

                        <TouchableOpacity
                            style={estilos.botaoQuantidade}
                            onPress={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                        >
                            <Icon
                                name="plus"
                                type="material-community"
                                size={14}
                                color={theme.colors.black}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={estilos.botaoRemover}
                        onPress={() => removerItem(item.id)}
                        activeOpacity={theme.opacity.active}
                    >
                        <Icon
                            name="trash-can-outline"
                            type="material-community"
                            size={20}
                            color={theme.colors.error}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    // Renderizar resumo do pedido
    const renderizarResumo = () => (
        <View style={estilos.resumoContainer}>
            <View style={estilos.linhaResumo}>
                <Text style={estilos.textoResumoLabel}>
                    Subtotal ({resumo.quantidadeSelecionada} itens):
                </Text>
                <Text style={estilos.textoResumoValor}>
                    {formatarPreco(resumo.subtotal)}
                </Text>
            </View>

            <View style={estilos.linhaResumo}>
                <Text style={estilos.textoResumoLabel}>Frete:</Text>
                <Text style={estilos.textoResumoValor}>
                    {formatarPreco(resumo.frete)}
                </Text>
            </View>

            <View style={estilos.linhaResumoTotal}>
                <Text style={estilos.textoTotalLabel}>Total:</Text>
                <Text style={estilos.textoTotalValor}>
                    {formatarPreco(resumo.total)}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    estilos.botaoFinalizar,
                    (resumo.quantidadeSelecionada === 0 || estaCarregandoCheckout) && estilos.botaoFinalizarDesabilitado
                ]}
                onPress={finalizarCompra}
                activeOpacity={theme.opacity.active}
                disabled={resumo.quantidadeSelecionada === 0 || estaCarregandoCheckout}
            >
                {estaCarregandoCheckout ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator color={theme.colors.white} />
                        <Text style={[estilos.textoBotaoFinalizar, { marginLeft: 8 }]}>Processando...</Text>
                    </View>
                ) : (
                    <Text style={estilos.textoBotaoFinalizar}>
                        {resumo.quantidadeSelecionada > 0
                            ? `FINALIZAR COMPRA (${resumo.quantidadeSelecionada})`
                            : 'SELECIONE ITENS PARA COMPRAR'
                        }
                    </Text>
                )}
            </TouchableOpacity>
            {/* PaymentSheet nativo removido — usamos apenas Checkout hospedado (browser) */}
        </View>
    );

    // Renderizar estado vazio
    const renderizarEstadoVazio = () => (
        <View style={estilos.containerVazio}>
            <View style={estilos.iconeContainer}>
                <Icon
                    name="shopping-outline"
                    type="material-community"
                    size={80}
                    color={theme.colors.gray300}
                />
            </View>

            <Text style={estilos.textoVazioTitulo}>
                Seu carrinho está vazio
            </Text>

            <Text style={estilos.textoVazioDescricao}>
                Adicione produtos incríveis ao seu carrinho
            </Text>

            <TouchableOpacity
                style={estilos.botaoExplorar}
                onPress={navegarParaProdutos}
                activeOpacity={theme.opacity.active}
            >
                <Text style={estilos.textoBotaoExplorar}>
                    Explorar produtos
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Verificar se está logado
    useEffect(() => {
        if (!estaLogado) {
            Alert.alert(
                'Login necessário',
                'Faça login para acessar o carrinho',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Fazer Login',
                        onPress: navegarParaLogin,
                    },
                ]
            );
        }
    }, [estaLogado]);

    return (
        <SafeAreaView style={estilos.container}>
            {itensCarrinho.length === 0 ? (
                <ScrollView
                    contentContainerStyle={estilos.scrollVazio}
                    showsVerticalScrollIndicator={false}
                >
                    {renderizarEstadoVazio()}
                </ScrollView>
            ) : (
                <>
                    <View style={estilos.barraAcoes}>
                        <TouchableOpacity
                            style={estilos.botaoAcao}
                            onPress={alternarSelecionarTudo}
                            activeOpacity={0.7}
                        >
                            <CheckBox
                                checked={selecionarTudo}
                                onPress={alternarSelecionarTudo}
                                checkedColor={theme.colors.primary[500]}
                                uncheckedColor={theme.colors.gray300}
                            />
                            <Text style={estilos.textoSelecionarTudo}>
                                {selecionarTudo ? 'Desmarcar' : 'Selecionar '}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={estilos.botaoRemoverSelecionados}
                            onPress={removerSelecionados}
                            activeOpacity={theme.opacity.active}
                        >
                            <Icon
                                name="trash-can-outline"
                                type="material-community"
                                size={20}
                                color={theme.colors.error}
                            />
                            <Text style={estilos.textoRemoverSelecionados}>
                                Remover
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={itensCarrinho}
                        renderItem={renderizarItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={estilos.listaConteudo}
                        showsVerticalScrollIndicator={false}
                    />

                    {renderizarResumo()}
                </>
            )}
        </SafeAreaView>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tituloHeader: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.black,
        marginLeft: theme.spacing.sm,
    },
    barraAcoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray200,
        backgroundColor: theme.colors.white,
    },
    botaoAcao: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textoSelecionarTudo: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.fonts.body,
        color: theme.colors.gray700,
        marginLeft: theme.spacing.xs,
    },
    botaoRemoverSelecionados: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.sm,
    },
    textoRemoverSelecionados: {
        fontSize: theme.typography.sizes.sm,
        fontFamily: theme.fonts.body,
        color: theme.colors.error,
        marginLeft: theme.spacing.xs,
    },
    checkboxItem: {
        padding: 0,
        margin: 0,
        marginRight: theme.spacing.sm,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    listaConteudo: {
        paddingBottom: theme.spacing.xl,
    },
    itemCarrinho: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray100,
        backgroundColor: theme.colors.white,
        minHeight: 100,
    },
    imagemProduto: {
        width: 70,
        height: 70,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.gray100,
        marginRight: theme.spacing.md,
    },
    infoProduto: {
        flex: 1,
        justifyContent: 'center',
    },
    nomeProduto: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.black,
        marginBottom: 4,
        lineHeight: 20,
    },
    precoProduto: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.primary[600],
        marginBottom: theme.spacing.sm,
    },
    controlesItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controleQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.gray200,
    },
    botaoQuantidade: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        minWidth: 36,
        alignItems: 'center',
    },
    textoQuantidade: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.black,
        minWidth: 20,
        textAlign: 'center',
    },
    botaoRemover: {
        padding: theme.spacing.sm,
    },
    resumoContainer: {
        padding: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray200,
        backgroundColor: theme.colors.white,
        ...theme.shadows.md,
    },
    linhaResumo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    textoResumoLabel: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        color: theme.colors.gray600,
    },
    textoResumoValor: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.black,
    },
    linhaResumoTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.gray300,
    },
    textoTotalLabel: {
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.black,
    },
    textoTotalValor: {
        fontSize: theme.typography.sizes.xl,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.primary[600],
    },
    botaoFinalizar: {
        backgroundColor: theme.colors.primary[500],
        paddingVertical: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        ...theme.shadows.md,
    },
    botaoFinalizarDesabilitado: {
        backgroundColor: theme.colors.gray300,
        opacity: 0.7,
    },
    textoBotaoFinalizar: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.white,
        letterSpacing: 0.5,
    },
    containerVazio: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing['3xl'],
    },
    scrollVazio: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    iconeContainer: {
        marginBottom: theme.spacing.lg,
    },
    textoVazioTitulo: {
        fontSize: theme.typography.sizes.xl,
        fontFamily: theme.fonts.heading,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.black,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    textoVazioDescricao: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        color: theme.colors.gray600,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 22,
    },
    botaoExplorar: {
        backgroundColor: theme.colors.primary[500],
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.md,
    },
    textoBotaoExplorar: {
        fontSize: theme.typography.sizes.md,
        fontFamily: theme.fonts.body,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.white,
    },
});

export default Carrinho;