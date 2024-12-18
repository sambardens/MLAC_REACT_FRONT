import { Box } from '@chakra-ui/react';

const BrandUnderline = ({isSelected}) => (
  <Box
    w='100%'
    h='4px'
    background={isSelected ?'linear-gradient(to left, transparent, #FF0151)' : 'transparent'}
  />
);

export default BrandUnderline;
