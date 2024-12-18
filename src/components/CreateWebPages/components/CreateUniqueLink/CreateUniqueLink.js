import { Box, Heading, Text } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import CustomInput from '@/components/CustomInputs/CustomInput';

const CreateUniqueLink = ({ linkName, setLinkName, link, setLink, isNewLanding = true }) => {
	const { selectedLandingPage } = useSelector(state => state.user);

	const handleChange = e => {
		const { value } = e.target;
		setLink(value);
		const formattedLink = value?.replace(/[^a-z0-9-]+/gi, '_').toLowerCase();

		setLinkName(formattedLink);
	};

	useEffect(() => {
		if (selectedLandingPage?.name) {
			setLink(selectedLandingPage?.name);
			setLinkName(selectedLandingPage?.name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLandingPage?.name]);

	const url = `${process.env.NEXT_PUBLIC_FRONT_URL}/music/`;
	return (
		<Box>
			<Box mb='16px'>
				<Heading as='h3' mb='4px' fontSize='18px' fontWeight='500'>
					{isNewLanding ? 'Create' : 'Edit'} a unique link
				</Heading>
				<Text fontSize='14px' fontWeight='400' color='secondary' mb='16px'>
					This name will appear publicly in your URL
				</Text>
			</Box>
			<CustomInput
				label='Link name'
				mlLabel='0'
				placeholder='Enter link name'
				value={link}
				onChange={handleChange}
			/>
			<Text
				fontSize='16px'
				fontWeight='400'
				color={link ? 'black' : 'secondary'}
				mt='4px'
				mb='32px'
				pl='12px'
			>
				{url}
				<Text as='span' color='accent'>
					{link ? linkName : 'your link name'}
				</Text>
			</Text>
		</Box>
	);
};

export default CreateUniqueLink;
