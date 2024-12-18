import { Box } from '@chakra-ui/react';

const ProgressLine = ({ currentStep, n }) => {
  return (
    <Box
      h='8px'
      bgColor={currentStep > n ? 'accent' : 'bg.secondary'}
      w='100%'
      borderRadius='10px'
    ></Box>
  );
};

export default ProgressLine;
