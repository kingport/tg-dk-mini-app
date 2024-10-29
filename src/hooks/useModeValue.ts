import { useColorMode } from '@chakra-ui/react';

export function useModeValue(valueLight: string, valueDark: string) {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? valueLight : valueDark;
}
