import { Flex, Text } from '@chakra-ui/react';
import FigureArrowIcon from '@/assets/icons/all/figureArrow.svg';
import { poppins_400_14_21 } from '@/styles/fontStyles';

export const TextWithArrow = ({ text }) => {
  return (
    <Flex
      w={'100%'}
      h={'101px'}
      mt={'10px'}
      justifyContent={'space-between'}
      alignItems={'center'}
      position={'relative'}
    >
      <Text color={'textColor.gray'} sx={poppins_400_14_21} w={'100%'}>
        {text}
      </Text>
      <Flex
        mr={'27px'}
        alignItems='flex-start'
        h={'100%'}
        pl={'5px'}
        pt={'4px'}
      >
        <FigureArrowIcon />
      </Flex>
    </Flex>
  );
};
