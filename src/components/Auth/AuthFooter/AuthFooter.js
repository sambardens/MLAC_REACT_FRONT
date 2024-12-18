import { Box, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const AuthFooter = () => {
  return (
    <Box w={{ base: '100%', sm: '454px' }} mx='auto' mt='60px'>
      <Text
        fontSize='14px'
        lineHeight='1.5'
        fontWeight='400'
        color='secondary'
        textAlign='center'
      >
				By logging in, you automatically confirm that you have read and agree to
				the&nbsp;
        <Link
          as={NextLink}
          href='terms-of-use'
          color='accent'
          fontSize='14px'
          lineHeight='1.5'
          fontWeight='400'
        >
					Terms of use
        </Link>
				&nbsp;and&nbsp;
        <Link
          as={NextLink}
          href='privacy-policy'
          color='accent'
          fontSize='14px'
          lineHeight='1.5'
          fontWeight='400'
        >
					Privacy policy
        </Link>
      </Text>
    </Box>
  );
};

export default AuthFooter;
