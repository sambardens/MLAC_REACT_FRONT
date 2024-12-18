import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

const Field = ({ title, text }) => (
	<Flex align='center'>
		<Text fontWeight='400' fontSize='18px' color='black' mr='24px' minW='240px'>
			{title}
		</Text>
		<Text fontWeight='400' fontSize='16px' color='secondary' w='100%'>
			{text}
		</Text>
	</Flex>
);

const DistribureReleaseCard = () => {
	const { selectedRelease } = useSelector(state => state.user);
	const date = new Date(selectedRelease.releaseDate);

	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const year = date.getUTCFullYear().toString();
	const formattedDate = `${day}-${month}-${year}`;

	return (
		<Box p='16px' bg='bg.light' borderRadius='10px' mb='32px'>
			<Heading fontWeight='600' fontSize='18px' mb='24px' color='black'>
				{selectedRelease.name}
			</Heading>

			<Flex flexDir='column' gap='8px'>
				<Field title='Date' text={formattedDate} />
				<Field title='Current label/distribution' text={selectedRelease.label || ''} />
				{selectedRelease.releaseSpotifyId && (
					<Field
						title='Copyright'
						text={`${selectedRelease?.copyrights?.length > 0 ? selectedRelease?.copyrights[0].text : ''}`}
					/>
				)}
				{selectedRelease?.upc && <Field title='UPC' text={selectedRelease?.upc || ''} />}
			</Flex>
		</Box>
	);
};

export default DistribureReleaseCard;
