import { CheckBox, Icon } from '@rneui/themed';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    AppState,
    AppStateStatus,
    FlatList,
    Image,
    Linking,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CartItem } from '../src/@types/carrinho';
import { useAuth } from '../src/context/AuthContext';
import { useCarrinho } from '../src/hooks/useCarrinho';
import { styles } from '../src/styles/TelaCarrinhoStyles';
import { theme } from '../src/theme/theme';
import { formatarPreco } from '../src/utils/formatters';

const Carrinho = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const {
        cartItems,
        selectAll,
        isLoading,
        isRefreshing,
        error,
        isOnline,
        loadCartItems,
        updateQuantity,
        removeItem,
        calculateSummary,
        toggleItemSelection,
        toggleSelectAll,
        removeSelectedItems,
        validarParaCheckout,
        sincronizarCarrinho,
        refreshCart,
        verificarConexao,
        iniciarCheckoutDoCarrinho,
    } = useCarrinho();


    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [selectedItemsCount, setSelectedItemsCount] = useState(0);

    // Configurar header
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.headerContainer}>
                    {cartItems.length > 0 && (
                        <TouchableOpacity
                            style={styles.checkboxHeader}
                            onPress={toggleSelectAll}
                            activeOpacity={0.7}
                        >
                            <CheckBox
                                checked={selectAll}
                                onPress={toggleSelectAll}
                                checkedColor={theme.colors.primary[500]}
                                uncheckedColor={theme.colors.gray300}
                            />
                        </TouchableOpacity>
                    )}
                    
                    <Text style={styles.titleHeader}>
                        Carrinho ({cartItems.length})
                        {!isOnline && ' (Offline)'}
                    </Text>
                    
                    {!isOnline && (
                        <Icon
                            name="wifi-off"
                            type="material-community"
                            size={18}
                            color={theme.colors.warning}
                            style={styles.offlineIcon}
                        />
                    )}
                </View>
            ),
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: theme.colors.white,
            },
            headerTintColor: theme.colors.black,
            headerShadowVisible: true,
            headerRight: () => (
                <View style={styles.headerRight}>
                    {cartItems.length > 0 && (
                        <TouchableOpacity
                            onPress={handleSincronizar}
                            style={styles.syncButton}
                            disabled={isLoading || isOnline}
                        >
                            <Icon
                                name="sync"
                                type="material-community"
                                size={22}
                                color={(isLoading || isOnline) ? theme.colors.gray400 : theme.colors.primary[500]}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            ),
        });
    }, [navigation, selectAll, cartItems.length, isOnline, isLoading]);

    // Monitorar mudanças no estado do app
    useEffect(() => {
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    // Contar itens selecionados
    useEffect(() => {
        const count = cartItems.filter(item => item.selecionado).length;
        setSelectedItemsCount(count);
    }, [cartItems]);

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            // App voltou ao foreground, verificar conexão
            await verificarConexao();
            // Recarregar carrinho
            loadCartItems();
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    // Redirecionar para login se não estiver autenticado
    useEffect(() => {
        if (!authLoading && !isAuthenticated && cartItems.length > 0) {
            Alert.alert(
                'Login necessário',
                'Faça login para sincronizar seu carrinho',
                [
                    {
                        text: 'Continuar offline',
                        style: 'cancel',
                    },
                    {
                        text: 'Fazer Login',
                        onPress: () => router.push('/auth/Login/login'),
                    },
                ]
            );
        }
    }, [isAuthenticated, authLoading, cartItems.length]);

    // Verificar conexão ao montar o componente
    useEffect(() => {
        const verificarConexaoInicial = async () => {
            const conectado = await verificarConexao();
            
            if (!conectado && cartItems.length > 0) {
                Alert.alert(
                    'Modo Offline',
                    'Você está offline. Alterações serão salvas localmente e sincronizadas quando a conexão for restaurada.',
                    [{ text: 'Entendi' }]
                );
            }
        };

        verificarConexaoInicial();
    }, []);

    const summary = calculateSummary();



    // Sincronizar carrinho
    const handleSincronizar = async () => {
        if (!isAuthenticated) {
            Alert.alert(
                'Login necessário',
                'Faça login para sincronizar o carrinho',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Fazer Login',
                        onPress: () => router.push('/auth/Login/login'),
                    },
                ]
            );
            return;
        }

        try {
            await sincronizarCarrinho();
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    // Atualizar quantidade
    const handleUpdateQuantity = async (produtoId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        try {
            await updateQuantity(produtoId, newQuantity);
        } catch (error) {
            // Erro já tratado no hook
        }
    };

    // Remover item
    const handleRemoveItem = (produtoId: number, itemName: string) => {
        console.log('=== DEBUG: Iniciando remoção ===');
        console.log('Produto ID:', produtoId);
        console.log('Item Name:', itemName);
        console.log('Cart Items antes:', cartItems.length);
        console.log('Item existe?', cartItems.find(item => item.produtoId === produtoId));
        
        const item = cartItems.find(item => item.produtoId === produtoId);
        if (!item) {
            console.error('Item não encontrado no carrinho!');
            Alert.alert('Erro', 'Item não encontrado no carrinho');
            return;
        }

        Alert.alert(
            'Remover item',
            `Tem certeza que deseja remover "${itemName}" do carrinho?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        console.log('Confirmado: removendo item...');
                        try {
                            const success = await removeItem(produtoId); // ✅ Agora passando number
                            if (success) {
                                console.log('Item removido com sucesso!');
                                console.log('Cart Items depois:', cartItems.length);
                            } else {
                                console.error('Falha ao remover item');
                                Alert.alert('Erro', 'Não foi possível remover o item');
                            }
                        } catch (error) {
                            console.error('Erro na remoção:', error);
                            Alert.alert('Erro', 'Ocorreu um erro ao remover o item');
                        }
                    },
                },
            ]
        );
    };

    // Remover itens selecionados
    const handleRemoveSelectedItems = () => {
        if (selectedItemsCount === 0) {
            Alert.alert('Nenhum item selecionado', 'Selecione itens para remover.');
            return;
        }

        console.log('=== DEBUG: Removendo selecionados ===');
        console.log('Itens selecionados:', selectedItemsCount);

        Alert.alert(
            'Remover itens selecionados',
            `Deseja remover ${selectedItemsCount} item(ns) do carrinho?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        console.log('Confirmado: removendo selecionados...');
                        try {
                            await removeSelectedItems();
                            console.log('Itens selecionados removidos com sucesso!');
                        } catch (error) {
                            console.error('Erro ao remover selecionados:', error);
                            Alert.alert('Erro', 'Não foi possível remover os itens selecionados');
                        }
                    },
                },
            ]
        );
    }

    // Navegar para produtos
    const navigateToProducts = () => {
        router.push('/(tabs)/explorar');
    };

    // Finalizar compra
    const handleCheckout = async () => {
        console.log('[carrinho] handleCheckout: iniciada, selectedItemsCount=', selectedItemsCount, 'isAuthenticated=', isAuthenticated, 'isOnline=', isOnline, 'isLoading=', isLoading);
        if (!isAuthenticated) {
            Alert.alert(
                'Login necessário',
                'Faça login para finalizar a compra',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Fazer Login',
                        onPress: () => router.push('/auth/Login/login'),
                    },
                ]
            );
            return;
        }

        if (selectedItemsCount === 0) {
            Alert.alert('Nenhum item selecionado', 'Selecione itens para comprar.');
            return;
        }

        try {
            // Verificar conexão antes do checkout
            console.log('[carrinho] handleCheckout: verificando conexão...');
            const conectado = await verificarConexao();
            console.log('[carrinho] handleCheckout: conectado=', conectado);
            if (!conectado) {
                Alert.alert(
                    'Modo Offline',
                    'Você está offline. É necessário estar online para finalizar a compra.',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Tentar conectar', onPress: () => verificarConexao() }
                    ]
                );
                return;
            }

            await prosseguirCheckout();
        } catch (error) {
            console.error('[carrinho] handleCheckout erro:', error);
            Alert.alert('Erro', 'Não foi possível validar o carrinho. Tente novamente.');
        }
    };

    const prosseguirCheckout = async () => {
        try {
            console.log('[carrinho] prosseguirCheckout: iniciando validação do carrinho...');
            // Validar carrinho antes do checkout
            const validacao = await validarParaCheckout();
            console.log('[carrinho] prosseguirCheckout: validacao=', validacao);
            if (!validacao.valido) {
                Alert.alert(
                    'Itens indisponíveis',
                    validacao.mensagem || 'Alguns itens do seu carrinho não estão mais disponíveis.',
                    [
                        { text: 'OK' },
                        {
                            text: 'Remover indisponíveis',
                            onPress: async () => {
                                // Criar uma cópia dos itens disponíveis
                                const itensDisponiveis = cartItems.filter(item => 
                                    !validacao.itensIndisponiveis.some(
                                        (indisponivel: { produtoId: number }) => indisponivel.produtoId === item.produtoId
                                    )
                                );
                                
                                // Se todos os itens forem removidos, mostrar mensagem
                                if (itensDisponiveis.length === 0) {
                                    Alert.alert('Carrinho vazio', 'Todos os itens foram removidos pois estão indisponíveis.');
                                    return;
                                }
                                
                                Alert.alert(
                                    'Itens removidos',
                                    `Os itens indisponíveis foram removidos do carrinho.`,
                                    [{ text: 'OK' }]
                                );
                            }
                        }
                    ]
                );
                return;
            }

            // Prosseguir para checkout automaticamente (sem alerta de confirmação)
            console.log('[carrinho] prosseguirCheckout: iniciando iniciarCheckoutDoCarrinho() automaticamente');
            try {
                console.log('[carrinho] prosseguirCheckout: chamando iniciarCheckoutDoCarrinho()');
                const resp = await iniciarCheckoutDoCarrinho();
                console.log('[carrinho] iniciarCheckoutDoCarrinho retornou:', resp);
                if (!resp || !resp.checkoutUrl) {
                    Alert.alert('Erro', resp?.error || 'Não foi possível iniciar o checkout');
                    return;
                }

                const url = resp.checkoutUrl;
                console.log('[carrinho] prosseguirCheckout: opening url=', url);
                try {
                    if (Platform.OS === 'web') {
                        window.location.href = url;
                    } else {
                        const can = await Linking.canOpenURL(url);
                        console.log('[carrinho] prosseguirCheckout: Linking.canOpenURL =>', can, ' url=', url);
                        if (can) {
                            await Linking.openURL(url);
                        } else {
                            Alert.alert('Erro', 'Não foi possível abrir a URL de checkout.');
                        }
                    }
                } catch (err) {
                    console.error('[carrinho] prosseguirCheckout erro ao abrir URL:', err);
                    Alert.alert('Erro', 'Não foi possível abrir a URL de checkout.');
                }
            } catch (error: any) {
                console.error('[carrinho] erro ao iniciar checkout automaticamente:', error);
                const msg = error?.message || 'Erro ao iniciar checkout';
                Alert.alert('Erro', msg);
            }
        } catch (error) {
            console.error('[carrinho] Erro no checkout:', error);
            Alert.alert('Erro', 'Não foi possível processar o checkout. Tente novamente.');
        }
    };

    // Debug: iniciar checkout direto (long-press no botão) para testar se o endpoint é chamado
    const immediateCheckoutForDebug = async () => {
        console.log('[carrinho] immediateCheckoutForDebug: iniciando');
        try {
            const conectado = await verificarConexao();
            console.log('[carrinho] immediateCheckoutForDebug: conectado=', conectado);
            if (!conectado) {
                Alert.alert('Sem conexão', 'Conecte-se à internet para finalizar o checkout.');
                return;
            }

            console.log('[carrinho] immediateCheckoutForDebug: chamando iniciarCheckoutDoCarrinho()');
            const resp = await iniciarCheckoutDoCarrinho();
            console.log('[carrinho] immediateCheckoutForDebug: resp=', resp);

            if (!resp || !resp.checkoutUrl) {
                Alert.alert('Erro', resp?.error || 'Não foi possível iniciar o checkout');
                return;
            }

            const url = resp.checkoutUrl;
            console.log('[carrinho] immediateCheckoutForDebug: opening url=', url);
            try {
                if (Platform.OS === 'web') {
                    // navigate current tab in web to avoid popup blockers
                    window.location.href = url;
                } else {
                    const can = await Linking.canOpenURL(url);
                    console.log('[carrinho] immediateCheckoutForDebug: Linking.canOpenURL =>', can, ' url=', url);
                    if (can) {
                        await Linking.openURL(url);
                    } else {
                        Alert.alert('Erro', 'Não foi possível abrir a URL de checkout.');
                    }
                }
            } catch (err) {
                console.error('[carrinho] immediateCheckoutForDebug erro ao abrir URL:', err);
                Alert.alert('Erro', 'Não foi possível abrir a URL de checkout.');
            }
        } catch (error: any) {
            console.error('[carrinho] immediateCheckoutForDebug erro:', error);
            Alert.alert('Erro', error?.message || 'Erro ao iniciar checkout');
        }
    };

    // Renderizar item do carrinho
    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={[
            styles.cartItem,
            !item.disponivel && styles.itemIndisponivel
        ]}>
            <CheckBox
                checked={item.selecionado}
                onPress={() => toggleItemSelection(item.produtoId)}
                checkedColor={theme.colors.primary[500]}
                uncheckedColor={theme.colors.gray300}
                containerStyle={styles.checkboxItem}
                disabled={!item.disponivel || isLoading}
            />

            <Image
                source={{ uri: item.imagem || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
                defaultSource={{ uri: 'https://via.placeholder.com/150' }}
            />

            <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                    <Text style={[
                        styles.productName,
                        !item.disponivel && styles.textDisabled
                    ]} numberOfLines={2}>
                        {item.nome}
                    </Text>
                    {!item.disponivel && (
                        <View style={styles.indisponivelBadge}>
                            <Text style={styles.indisponivelText}>Indisponível</Text>
                        </View>
                    )}
                </View>
                
                <View style={styles.priceRow}>
                    <Text style={[
                        styles.productPrice,
                        !item.disponivel && styles.textDisabled
                    ]}>
                        {formatarPreco(item.preco)}
                    </Text>
                    <Text style={[
                        styles.subtotalText,
                        !item.disponivel && styles.textDisabled
                    ]}>
                        Subtotal: {formatarPreco(item.subtotal || item.preco * item.quantidade)}
                    </Text>
                </View>

                <View style={styles.itemControls}>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity
                            style={[
                                styles.quantityButton,
                                (!item.disponivel || item.quantidade <= 1 || isLoading) && styles.buttonDisabled
                            ]}
                            onPress={() => handleUpdateQuantity(item.produtoId, item.quantidade - 1)}
                            disabled={!item.disponivel || item.quantidade <= 1 || isLoading}
                        >
                            <Icon
                                name="minus"
                                type="material-community"
                                size={14}
                                color={(!item.disponivel || item.quantidade <= 1 || isLoading) ? theme.colors.gray300 : theme.colors.black}
                            />
                        </TouchableOpacity>

                        <Text style={[
                            styles.quantityText,
                            !item.disponivel && styles.textDisabled
                        ]}>
                            {item.quantidade}
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.quantityButton,
                                (!item.disponivel || isLoading) && styles.buttonDisabled
                            ]}
                            onPress={() => handleUpdateQuantity(item.produtoId, item.quantidade + 1)}
                            disabled={!item.disponivel || isLoading}
                        >
                            <Icon
                                name="plus"
                                type="material-community"
                                size={14}
                                color={(!item.disponivel || isLoading) ? theme.colors.gray300 : theme.colors.black}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveItem(item.produtoId, item.nome)}
                        disabled={isLoading}
                        activeOpacity={theme.opacity.active}
                    >
                        <Icon
                            name="trash-can-outline"
                            type="material-community"
                            size={20}
                            color={isLoading ? theme.colors.gray300 : theme.colors.error}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    // Renderizar resumo do pedido
    const renderSummary = () => (
        <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                    Subtotal ({summary.quantidadeSelecionada} itens):
                </Text>
                <Text style={styles.summaryValue}>
                    {formatarPreco(summary.subtotal)}
                </Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Frete:</Text>
                <Text style={styles.summaryValue}>
                    {formatarPreco(summary.frete)}
                </Text>
            </View>

            {!isOnline && (
                <View style={styles.offlineWarning}>
                    <Icon
                        name="wifi-off"
                        type="material-community"
                        size={16}
                        color={theme.colors.warning}
                    />
                    <Text style={styles.offlineWarningText}>
                        Modo offline - alguns valores podem não estar atualizados
                    </Text>
                </View>
            )}

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                    {formatarPreco(summary.total)}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.checkoutButton,
                    (selectedItemsCount === 0 || isLoading) && styles.checkoutButtonDisabled
                ]}
                onPress={handleCheckout}
                onLongPress={immediateCheckoutForDebug}
                activeOpacity={theme.opacity.active}
                disabled={selectedItemsCount === 0 || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color={theme.colors.white} size="small" />
                ) : (
                    <Text style={styles.checkoutButtonText}>
                        {selectedItemsCount > 0
                            ? `FINALIZAR COMPRA (${selectedItemsCount})`
                            : 'SELECIONE ITENS PARA COMPRAR'
                        }
                    </Text>
                )}
            </TouchableOpacity>
            
        </View>
    );

    // Renderizar estado vazio
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.iconContainer}>
                <Icon
                    name="shopping-outline"
                    type="material-community"
                    size={80}
                    color={theme.colors.gray300}
                />
            </View>

            <Text style={styles.emptyTitle}>
                {error ? 'Erro ao carregar carrinho' : 'Seu carrinho está vazio'}
            </Text>

            <Text style={styles.emptyDescription}>
                {error 
                    ? 'Não foi possível carregar os itens do carrinho. Tente novamente.'
                    : 'Adicione produtos incríveis ao seu carrinho'
                }
            </Text>

            <TouchableOpacity
                style={styles.exploreButton}
                onPress={error ? refreshCart : navigateToProducts}
                activeOpacity={theme.opacity.active}
                disabled={isLoading}
            >
                <Text style={styles.exploreButtonText}>
                    {error ? 'Tentar novamente' : 'Explorar produtos'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Renderizar loading
    if ((isLoading || authLoading) && cartItems.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.colors.primary[500]} />
                <Text style={styles.loadingText}>Carregando carrinho...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {cartItems.length === 0 ? (
                <ScrollView
                    contentContainerStyle={styles.emptyScroll}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={refreshCart}
                            colors={[theme.colors.primary[500]]}
                        />
                    }
                >
                    {renderEmptyState()}
                </ScrollView>
            ) : (
                <>
                    <View style={styles.actionsBar}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={toggleSelectAll}
                            activeOpacity={0.7}
                            disabled={isLoading}
                        >
                            <CheckBox
                                checked={selectAll}
                                onPress={toggleSelectAll}
                                checkedColor={theme.colors.primary[500]}
                                uncheckedColor={theme.colors.gray300}
                                disabled={isLoading}
                            />
                            <Text style={styles.selectAllText}>
                                {selectAll ? 'Desmarcar todos' : 'Selecionar todos'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.removeSelectedButton}
                            onPress={handleRemoveSelectedItems}
                            disabled={isLoading || selectedItemsCount === 0}
                            activeOpacity={theme.opacity.active}
                        >
                            <Icon
                                name="trash-can-outline"
                                type="material-community"
                                size={20}
                                color={isLoading || selectedItemsCount === 0 ? theme.colors.gray300 : theme.colors.error}
                            />
                            <Text style={[
                                styles.removeSelectedText,
                                (isLoading || selectedItemsCount === 0) && styles.textDisabled
                            ]}>
                                Remover selecionados ({selectedItemsCount})
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={cartItems}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={refreshCart}
                                colors={[theme.colors.primary[500]]}
                            />
                        }
                        ListEmptyComponent={renderEmptyState}
                        ListFooterComponent={cartItems.length > 0 ? renderSummary : null}
                    />
                </>
            )}
        </SafeAreaView>
    );
};

export default Carrinho;