import Image from 'next/image';
import NextLink from 'next/link';

import { Flex, Link } from '@chakra-ui/react';

const Logo = () => {
	return (
		<Flex justifyContent='center' mb='60px'>
			<Link as={NextLink} href='/'>
				<Image src='/assets/images/logo-primary.png' alt='logo Major Labl' width={160} height={90} />
			</Link>
		</Flex>
	);
};

export default Logo;
