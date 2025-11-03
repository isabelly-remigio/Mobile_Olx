import { Box, Text } from 'native-base';
import React from 'react';

export function Header() {
  return (
    <Box bg="primary.500" p={4}>
      <Text color="white" fontSize="lg" fontWeight="bold">
        OLX Mobile
      </Text>
    </Box>
  );
}
