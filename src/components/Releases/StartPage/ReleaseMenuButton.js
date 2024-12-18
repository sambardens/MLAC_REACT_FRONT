import React from 'react';
import { Flex } from '@chakra-ui/react';

const ReleaseMenuButton = ({ children }) => (
  <Flex
    justifyContent={'center'}
    alignItems={'center'}
    w='150px'
    h='150px'
    p='5px'
    bg='brand.mainGray'
    borderRadius={'20px'}
    boxShadow={'1px 1px 3px gray'}
    textAlign='center'
    fontSize={'12px'}
  >
    {children}
  </Flex>
);

export default ReleaseMenuButton;
