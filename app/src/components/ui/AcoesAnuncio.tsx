// components/ui/AcoesAnuncio.tsx
import React from 'react';
import { Box, HStack, IconButton, Icon, Button } from 'native-base';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { AcoesAnuncioProps } from '../../@types/anuncio';

export const AcoesAnuncio: React.FC<AcoesAnuncioProps> = ({
    onWhatsApp,
    onComprarAgora,
    onAdicionarCarrinho,
}) => {
    return (
        <Box
            bg="white"
            borderTopWidth={1}
            borderTopColor="gray.200"
            px={3}
            py={2}
            safeAreaBottom
            shadow={3}
        >
            <HStack space={2} alignItems="center">

                <Button
                    bg="white"
                    borderWidth={1}
                    borderColor="secondary.500"
                    _pressed={{ bg: 'secondary.50' }}
                    _text={{
                        color: 'secondary.500',
                        fontWeight: 'medium',
                        fontSize: 'xs',
                    }}
                    flex={1}
                    h={12}
                    borderRadius="md"
                    onPress={onAdicionarCarrinho}
                    leftIcon={
                        <Icon
                            as={MaterialIcons}
                            name="add-shopping-cart"
                            size={5}
                            color="secondary.500"
                        />
                    }
                >
                    Carrinho
                </Button>

                <Button
                    bg="secondary.500"
                    _pressed={{ bg: 'secondary.600' }}
                    _text={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 'sm',
                    }}
                    flex={1}
                    h={12}
                    borderRadius="md"
                    onPress={onComprarAgora}
                    leftIcon={
                        <Icon as={MaterialIcons} name="shopping-cart" size={5} color="white" />
                    }
                >
                    Comprar
                </Button>

                <IconButton
                    onPress={onWhatsApp}
                    bg="transparent"         
                    _pressed={{ bg: "gray.200" }}
                    borderRadius="full"      
                    icon={
                        <Icon
                            as={FontAwesome}
                            name="whatsapp"
                            size={8}
                            color="#25D366"
                        />
                    }
                    h={12}
                    w={12}
                    justifyContent="center"
                    alignItems="center"
                />

            </HStack>
        </Box>
    );
};
