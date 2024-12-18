import { Box, Flex } from '@chakra-ui/react';

import React from 'react';

import Meta from '@/components/Meta/Meta';

import AuthFooter from '../Auth/AuthFooter/AuthFooter';
import AuthImage from '../Auth/AuthImage/AuthImage';
import Logo from '../Auth/Logo/Logo';

const AuthLayout = ({ children, title, description, footer = true }) => {
	return (
		<>
			<Meta title={title} description={description} />
			<Box>
				<Flex
					flexDir={{ base: 'column', xl: 'row' }}
					w='100vw'
					h='100vh'
					fontFamily={'Poppins-Medium, sans-serif'}
					letterSpacing={'1px'}
					bg='bg.auth'
				>
					<Flex
						flexDir='column'
						justifyContent='space-between'
						alignItems='center'
						px='16px'
						py='48px'
						w={{ base: '100%', md: '51%' }}
						overflow='auto'
					>
						<Box>
							<Logo />
							{children}
						</Box>
						{footer && <AuthFooter />}
					</Flex>
					<AuthImage />
				</Flex>
			</Box>
		</>
	);
};

export default AuthLayout;
