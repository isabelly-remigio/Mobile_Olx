// src/@types/carrinho.ts
export interface CarrinhoItemAPI {
    id?: number;
    produto: {
        id: number;
        nome: string;
        preco: number;
        imagemUrl?: string;
        quantidadeEstoque: number;
    };
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
    dataAdicao?: string;
}

export interface CartItem {
    id: string;
    produtoId: number; // DEVE SER STRING!
    produto?: {
        id: string;
        nome: string;
        preco: number;
        imagemUrl?: string;
        imagem?: string;
        descricao?: string;
        estoque?: number;
        disponivel?: boolean;
        categoria?: string;
    };
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
    nome: string;
    preco: number;
    imagem: string;
    disponivel: boolean;
    selecionado: boolean;
}

export interface OrderSummary {
    subtotal: number;
    frete: number;
    total: number;
    quantidadeSelecionada: number;
    totalItens: number;
}

export interface AddItemRequest {
    produtoId: number;
    quantidade: number;
}

export interface UpdateQuantityRequest {
    produtoId: number;
    quantidade: number;
}