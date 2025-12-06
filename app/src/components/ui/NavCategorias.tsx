import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { Categoria } from '../../@types/home';
import { NavCategoriasStyles } from '../../styles/components/NavCategoriasStyles';

interface NavCategoriasProps {
  categorias: Categoria[];
  ativa: string;
  onChangeCategoria: (id: string) => void;
}

const NavCategorias = ({ categorias, ativa, onChangeCategoria }: NavCategoriasProps) => {
  return (
    <View style={NavCategoriasStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={NavCategoriasStyles.scrollContent}
      >
        {categorias.map((categoria) => {
          const ativaCategoria = ativa === categoria.id;
          return (
            <TouchableOpacity
              key={categoria.id}
              style={NavCategoriasStyles.categoriaButton}
              onPress={() => onChangeCategoria(categoria.id)}
              activeOpacity={0.7}
            >
              <View style={NavCategoriasStyles.categoriaContent}>
                <View
                  style={[
                    NavCategoriasStyles.iconContainer,
                    ativaCategoria && NavCategoriasStyles.iconContainerAtiva,
                  ]}
                >
                  <Icon
                    name={categoria.icone}
                    type="material"
                    size={24} // Tamanho do ícone
                    color={ativaCategoria ? '#FFFFFF' : '#6B7280'}
                  />
                </View>
                <Text
                  style={[
                    NavCategoriasStyles.categoriaText,
                    ativaCategoria 
                      ? NavCategoriasStyles.categoriaAtivaText 
                      : NavCategoriasStyles.categoriaInativaText,
                  ]}
                  numberOfLines={1}
                >
                  {categoria.nome}
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