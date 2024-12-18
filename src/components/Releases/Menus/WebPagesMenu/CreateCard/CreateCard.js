import {
  Flex, Heading, Icon, Text,
} from '@chakra-ui/react';

import PlusIcon from '@/assets/icons/base/plus.svg';

const CreateCard = ({
  title, text, onClickHandler, h = '120px', mt,
}) => {
  return (
    <Flex
      align='center' h={h} mt={mt}
      bg='bg.main' borderRadius='10px'>
      <Flex
        // mr='32px'
        // mt={mt}
        as='button'
        minW='197px'
        h='100%'
        bg='bg.light'
        align='center'
        justify='center'
        borderRadius='10px'
        cursor='pointer'
        onClick={onClickHandler}
      >
        <Flex justify='center' align='center' flexDir='column'>
          <Icon as={PlusIcon} boxSize='24px' color='accent' />
        </Flex>
      </Flex>
      <Flex px='24px' justify='center' flexDir='column'>
        <Heading
          as='h4'
          mb='4px'
          fontSize='16px'
          fontWeight='400'
          color='black'
        >
          {title}
        </Heading>
        <Text fontSize='14px' fontWeight='400' color='secondary'>
          {text}
        </Text>
      </Flex>
    </Flex>
  );
};

export default CreateCard;
