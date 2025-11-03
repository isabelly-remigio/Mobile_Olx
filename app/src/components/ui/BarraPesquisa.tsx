import { Input } from 'native-base';
import React from 'react';

type BarraPesquisaProps = {
  placeholder?: string;
  valor?: string;
  aoMudar?: (novoValor: string) => void;
};

export function BarraPesquisa({ placeholder = 'Buscar...', valor, aoMudar }: BarraPesquisaProps) {
  return (
    <Input
      placeholder={placeholder}
      value={valor}
      onChangeText={aoMudar}
      mb={4}
      bg="gray.100"
      borderRadius="md"
      px={3}
    />
  );
}
