import {
  Box, Flex, IconButton, Radio, Text,
} from '@chakra-ui/react';
import { poppins_400_14_21, poppins_500_16_24 } from '@/styles/fontStyles';
import CheckedRadioButtonIcon from '@/assets/icons/modal/checkedRadioButton.svg';
import RadioButtonIcon from '@/assets/icons/modal/radioButton.svg';

export const JoinVariant = ({
  item, handler, selectedOptions, mt,
}) => {
  const { title, id, text } = item;

  return (
    <Box
      onClick={() => handler(id)}
      bg={'bg.main'}
      px={'15px'}
      py={'13px'}
      w={'100%'}
      border={'1px'}
      borderColor={'brand.lightGray'}
      borderRadius={'10px'}
      mt={mt}
      cursor={'pointer'}
    >
      <Flex>
        <Flex alignItems={'flex-start'} pt={'2px'}>
          <IconButton
            icon={
              selectedOptions === id ? (
                <CheckedRadioButtonIcon />
              ) : (
                <RadioButtonIcon />
              )
            }
            _hover={{}}
            _focus={{}}
            _active={{}}
            minW={'24px'}
            h={'18px'}

          />
        </Flex>

        <Box ml={'15px'}>
          <Text as='h3' sx={poppins_500_16_24} color={'textColor.black'}>
            {title}
          </Text>
          <Text sx={poppins_400_14_21} color={'textColor.gray'} mt={'8px'}>
            {text}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
