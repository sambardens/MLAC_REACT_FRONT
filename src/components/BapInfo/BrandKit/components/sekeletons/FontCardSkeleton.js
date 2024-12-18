import {
  Box, Flex, ListItem, UnorderedList,
} from '@chakra-ui/react';

const FontCardSkeleton = () => {
  return (
    <UnorderedList
      m={'0'} mt={'8px'} p={'10px'}
      className='animate-pulse'>
      {[1, 2, 3]?.map((item) => {
        return (
          <ListItem key={item} listStyleType={'none'} py={'7px'}>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Box
                className='animate-pulse'
                w={'130px'}
                h={'20px'}
                bg={'bg.secondary'}
                borderRadius={'5px'}
              ></Box>
              <Box
                w={'30px'}
                h={'30px'}
                borderRadius={'50%'}
                bg={'bg.secondary'}
              ></Box>
            </Flex>
          </ListItem>
        );
      })}
    </UnorderedList>
  );
};

export default FontCardSkeleton;
