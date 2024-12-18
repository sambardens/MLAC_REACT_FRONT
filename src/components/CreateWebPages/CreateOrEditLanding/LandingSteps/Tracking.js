import { Box, Flex, Text } from '@chakra-ui/react';

import { useState } from 'react';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomTextarea from '@/components/CustomInputs/CustomTextarea';

const Tracking = ({ handleChangeTracking, trackingData }) => {
	const { facebookPixel, metaTitle, metaDescription } = trackingData;
	const [isValidFbPixel, setIsValidFbPixel] = useState(true);

	const handleBlurFbPixel = () => {
		setIsValidFbPixel(facebookPixel?.length === 0 || facebookPixel?.length === 15);
	};
	return (
		<Box>
			<Text fontWeight={'600'} fontSize={'18px'} mb='16px'>
				Tracking
			</Text>
			<Flex gap='24px' flexDir='column'>
				<CustomInput
					label='Facebook Pixel'
					name='facebookPixel'
					placeholder={'Please enter a 15-digit Facebook pixel number'}
					onChange={handleChangeTracking}
					onBlur={handleBlurFbPixel}
					value={facebookPixel || ''}
					maxLength={15}
					mlLabel='0'
					isInvalid={!isValidFbPixel}
				/>

				<CustomInput
					label='SEO title tag'
					name='metaTitle'
					onChange={handleChangeTracking}
					value={metaTitle}
					placeholder={'Enter text'}
					mlLabel='0'
				/>
				<CustomTextarea
					label='SEO meta description (500 characters)'
					name='metaDescription'
					onChange={handleChangeTracking}
					value={metaDescription}
					placeholder={'Enter text'}
					mlLabel='0'
					maxLength={500}
				/>
			</Flex>
		</Box>
	);
};
export default Tracking;
