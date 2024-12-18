import { Box, Flex, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setFbPixel, setMetaDescription, setMetaTitle } from 'store/shop/shop-slice';

import CreateWebPageSocialLinks from '@/components/CreateWebPages/components/CreateWebPageSocialLinks/CreateWebPageSocialLinks';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomTextarea from '@/components/CustomInputs/CustomTextarea';

import CreateUniqueLinkShop from './components/CreateUniqueLinkShop';

const BasicSettings = ({
	isNewShop,
	showSocialLinks,
	setShowSocialLinks,
	setValidSocialLinks,
	validSocialLinks,
	setSocialLinks,
	socialLinks,
	invalidSocialLinks,
	setInvalidSocialLinks,
	setSocialLinksType,
	socialLinksType,
	isValidFbPixel,
	setIsValidFbPixel,
}) => {
	const shop = useSelector(state => state.shop);
	const { selectedBap } = useSelector(state => state.user);
	const [fbPixelInput, setFbPixelInput] = useState(shop?.fbPixel || '');
	const [metaTitleInput, setMetaTitleInput] = useState(shop?.metaTitle || '');
	const [metaDescriptionInput, setMetaDescriptionInput] = useState(shop?.metaDescription || '');
	const dispatch = useDispatch();

	const handleChangeFbPixel = e => {
		const { value } = e.target;
		const numberRegex = /^[0-9]+$/;
		if (value === '' || numberRegex.test(value)) {
			setFbPixelInput(value);
		}
	};

	const handleBlurFbPixel = () => {
		dispatch(setFbPixel(fbPixelInput));
		setIsValidFbPixel(fbPixelInput?.length === 0 || fbPixelInput?.length === 15);
	};
	return (
		<>
			<CreateUniqueLinkShop bapName={selectedBap?.bapName} />
			<CreateWebPageSocialLinks
				setValidSocialLinks={setValidSocialLinks}
				validSocialLinks={validSocialLinks}
				setSocialLinks={setSocialLinks}
				socialLinks={socialLinks}
				invalidSocialLinks={invalidSocialLinks}
				setInvalidSocialLinks={setInvalidSocialLinks}
				showSocialLinks={showSocialLinks}
				setShowSocialLinks={setShowSocialLinks}
				socialLinksType={socialLinksType}
				setSocialLinksType={setSocialLinksType}
				isNew={isNewShop}
				isShop={true}
			/>
			<Box mt='32px'>
				<Text fontWeight={'500'} fontSize={'18px'} color='black'>
					Tracking
				</Text>
				<Flex gap='24px' flexDir='column' mt='16px'>
					<CustomInput
						label='Facebook Pixel'
						name='facebookPixel'
						placeholder={'Please enter a 15-digit Facebook pixel number'}
						onChange={handleChangeFbPixel}
						onBlur={handleBlurFbPixel}
						value={fbPixelInput}
						maxLength={15}
						mlLabel='0'
						isInvalid={!isValidFbPixel}
					/>

					<CustomInput
						label='SEO title tag'
						onChange={e => {
							setMetaTitleInput(e.target.value);
						}}
						onBlur={e => {
							dispatch(setMetaTitle(e.target.value));
						}}
						value={metaTitleInput}
						placeholder={'Enter text'}
						mlLabel='0'
					/>

					<CustomTextarea
						label='SEO meta description (500 characters)'
						onChange={e => {
							setMetaDescriptionInput(e.target.value);
						}}
						onBlur={e => {
							dispatch(setMetaDescription(e.target.value));
						}}
						value={metaDescriptionInput}
						placeholder={'Enter text'}
						maxLength={500}
						mlLabel='0'
					/>
				</Flex>
			</Box>
		</>
	);
};

export default BasicSettings;
