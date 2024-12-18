import Link from 'next/link';

import { Box, Flex, Text } from '@chakra-ui/react';

import { poppins_500_24, poppins_800_50 } from '@/styles/fontStyles';

const Error404 = ({ path = '/' }) => {
	return (
		<Flex w='100%' h='100vh' bg='bg.bg404' alignItems='center' justifyContent={'center'} px='55px'>
			<Box>
				<Text as='h1' sx={poppins_800_50} color='accent'>
					Oops! 404
				</Text>
				<Text sx={poppins_500_24} mt='20px' color='brand.white'>
					It happens sometimes
				</Text>
				<Link href={path}>
					<Text
						sx={poppins_500_24}
						color='accent'
						mt='10px'
						textAlign={'center'}
						textDecoration='underline'
						textUnderlineOffset='5px'
					>
						Come back
					</Text>
				</Link>
			</Box>
		</Flex>
	);
};

export default Error404;
