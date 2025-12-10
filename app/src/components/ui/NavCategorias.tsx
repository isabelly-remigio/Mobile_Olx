import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { Categoria } from '../../@types/home';
import { NavCategoriasStyles } from '../../styles/components/NavCategoriasStyles';

interface NavCategoriasProps {
  categorias: Categoria[];
  ativa: string;
  onChangeCategoria: (id: string) => void;
  carregando?: boolean; // Adicione esta prop opcional
}

const NavCategorias = ({ 
  categorias, 
  ativa, 
  onChangeCategoria,
  carregando = false 
}: NavCategoriasProps) => {
  
  const handlePress = (categoriaId: string) => {
    // Evita múltiplos cliques enquanto carrega
    if (!carregando || categoriaId !== ativa) {
      onChangeCategoria(categoriaId);
    }
  };

  return (
    <View style={NavCategoriasStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={NavCategoriasStyles.scrollContent}
      >
        {categorias.map((categoria) => {
          const ativaCategoria = ativa === categoria.id;
          const estaCarregando = carregando && ativaCategoria;
          
          return (
            <TouchableOpacity
              key={categoria.id}
              style={[
                NavCategoriasStyles.categoriaButton,
                carregando && { opacity: 0.7 } // Feedback visual durante loading
              ]}
              onPress={() => handlePress(categoria.id)}
              activeOpacity={0.7}
              disabled={carregando && ativaCategoria} // Desabilita se já está carregando esta categoria
            >
              <View style={NavCategoriasStyles.categoriaContent}>
                <View
                  style={[
                    NavCategoriasStyles.iconContainer,
                    ativaCategoria && NavCategoriasStyles.iconContainerAtiva,
                    estaCarregando && { backgroundColor: '#93C5FD' } // Cor de loading
                  ]}
                >
                  {estaCarregando ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Icon
                      name={categoria.icone}
                      type="material"
                      size={24}
                      color={ativaCategoria ? '#FFFFFF' : '#6B7280'}
                    />
                  )}
                </View>
                <Text
                  style={[
                    NavCategoriasStyles.categoriaText,
                    ativaCategoria 
                      ? NavCategoriasStyles.categoriaAtivaText 
                      : NavCategoriasStyles.categoriaInativaText,
                    estaCarregando && { color: '#3B82F6' } // Texto azul durante loading
                  ]}
                  numberOfLines={1}
                >
                  {categoria.nome}
                  {estaCarregando && '...'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default NavCategorias;