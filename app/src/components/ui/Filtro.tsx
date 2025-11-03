import { Modal, Button, VStack, Checkbox, Text } from 'native-base';
import React, { useState } from 'react';

type FiltroProps = {
  aberto: boolean;
  aoFechar: () => void;
  categorias: string[];
  estados: string[];
};

export function Filtro({ aberto, aoFechar, categorias, estados }: FiltroProps) {
  const [selecionados, setSelecionados] = useState<string[]>([]);

  return (
    <Modal isOpen={aberto} onClose={aoFechar}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Filtros</Modal.Header>
        <Modal.Body>
          <VStack space={3}>
            <Text bold>Categorias</Text>
            {categorias.map(cat => (
              <Checkbox
                key={cat}
                value={cat}
                isChecked={selecionados.includes(cat)}
                onChange={() =>
                  setSelecionados(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
                }
              >
                {cat}
              </Checkbox>
            ))}
            <Text bold>Estados</Text>
            {estados.map(est => (
              <Checkbox key={est} value={est}>{est}</Checkbox>
            ))}
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={aoFechar}>Aplicar</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
