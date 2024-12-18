import { Flex } from '@chakra-ui/react';

const FeatureArtistList = ({ children }) => {
	return (
		// <Flex
		// 	zIndex='100'
		// 	w='100%'
		// 	pos='absolute'
		// 	bottom='-8px'
		// 	transform={'translateY(100%)'}
		// 	as='ul'
		// 	mt='8px'
		// 	flexDir='column'
		// 	bgColor='bg.main'
		// 	boxShadow='0px 4px 7px 5px rgba(136, 136, 136, 0.1)'
		// 	maxH='224px'
		// 	overflowY='scroll'
		// 	borderRadius='10px'
		// >
		// 	{children}
		// </Flex>

		<Flex
			w='100%'
			as='ul'
			my='8px'
			flexDir='column'
			bgColor='bg.main'
			boxShadow='0px 4px 7px 5px rgba(136, 136, 136, 0.1)'
			maxH='224px'
			overflowY='scroll'
			borderRadius='10px'
		>
			{children}
		</Flex>
	);
};

export default FeatureArtistList;
