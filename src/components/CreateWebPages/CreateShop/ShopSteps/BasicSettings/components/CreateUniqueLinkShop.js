import { Box, Heading, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLinkNameError, setLinkName } from 'store/shop/shop-slice';

import CustomInput from '@/components/CustomInputs/CustomInput';

const CreateUniqueLinkShop = ({ bapName }) => {
	const shop = useSelector(state => state.shop);
	const dispatch = useDispatch();
	const [link, setLink] = useState(shop?.linkName || '');
	const [isLinkError, setIsLinkError] = useState(false);

	useEffect(() => {
		setIsLinkError(shop.isLinkNameError);
	}, [shop]);
	// const formattedBapName = bapName?.replace(/[^a-z0-9]+/gi, '_')?.toLowerCase();
	const formattedBapName = '';
	const url = `${process.env.NEXT_PUBLIC_FRONT_URL}/${
		formattedBapName ? formattedBapName : 'music'
	}/shop/`;

	const formattedLink = link?.toLowerCase().replace(/[^a-z0-9]+/gi, '_');

	const handleLinkInput = e => {
		const { value } = e.target;
		if (!value) {
			setIsLinkError(true);
		}

		if (value && shop.isLinkNameError) {
			setIsLinkError(false);
			dispatch(setIsLinkNameError(false));
		}
		const formattedValue = value.replace(/[^a-z0-9]+/gi, '_')?.toLowerCase();
		setLink(formattedValue);
	};

	const handleBlur = e => {
		const { value } = e.target;
		const formattedValue = value.replace(/[^a-z0-9]+/gi, '_')?.toLowerCase();
		dispatch(setLinkName(formattedValue));
	};

	return (
		<Box>
			<Box mb='16px'>
				<Heading as='h3' mb='4px' fontSize='18px' fontWeight='500' lineHeight='1.5'>
					Create a unique link
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
				onChange={handleLinkInput}
				onBlur={handleBlur}
				isInvalid={isLinkError}
				errors={'Required'}
				mlError='12px'
			/>
			<Text fontSize='16px' fontWeight='400' color={link ? 'black' : 'secondary'} mt='4px'>
				<Text as='span' whiteSpace='nowrap'>
					{url}
				</Text>

				<Text as='span' color='accent' overflowWrap='break-word'>
					{link ? formattedLink : 'your link name'}
				</Text>
			</Text>
		</Box>
	);
};

export default CreateUniqueLinkShop;
