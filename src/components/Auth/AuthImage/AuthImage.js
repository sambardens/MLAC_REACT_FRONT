import Image from 'next/image';

import { Flex, Text } from '@chakra-ui/react';

// export const AuthImage = () => (
//   <Flex
//     position={'fixed'}
//     right='0'
//     justifyContent={'end'}
//     w={{ base: '100%', md: '49%' }}
//     h='100vh'
//     minH='700px'
//     p='12px'
//     background='url(/assets/images/auth.png) center center no-repeat'
//     backgroundSize='cover'
//     color={'red'}
//   >
//     <Flex>
//       <Text color={'brand.red'}>
//       Artist:
//       </Text>
//       <Text ml='4px' color={'white'}>
//       Porcelain
//       </Text>
//     </Flex>
//   </Flex>
// );

export const AuthImage = () => (
	<Flex
		position={'fixed'}
		right='0'
		justifyContent={'end'}
		w={{ base: '49%' }}
		h='100vh'
		minH='700px'
		// backgroundColor={'red'} // Изменил background на backgroundColor
		// color={'white'} // Изменил цвет текста на белый
	>
		<Image
			src='/assets/images/auth.png' // Путь к изображению в папке public
			alt='Artist: Porcelain'
			fill
			sizes='49vw'
			style={{ objectFit: 'cover' }}
		/>
		<Flex pos='absolute' top='12px' right='12px'>
			<Text color='accent'>Artist:</Text>
			<Text ml='4px' color={'white'}>
				Porcelain
			</Text>
		</Flex>
	</Flex>
);

export default AuthImage;
