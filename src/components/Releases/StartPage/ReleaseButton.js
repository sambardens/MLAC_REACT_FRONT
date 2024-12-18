import { Flex } from '@chakra-ui/react';
import React from 'react';

const ReleaseButton = ({ children, color }) => (
  <Flex
    flexDir={'column'}
    justifyContent='center'
    alignItems={'center'}
    w='200px'
    h='200px'
    p='10px'
    color='#fff'
    borderRadius={'10px'}
    bg='#fff'
    _hover={{ border: '3px solid', borderColor: 'accent' }}
    transition='0.3s linear'
  >
    <Flex
      w='100%'
      h='100%'
      justifyContent='center'
      alignItems={'center'}
      bgColor={`${color}`}
      borderRadius={'10px'}
    >
      {children}
    </Flex>
  </Flex>
);

export default ReleaseButton;
