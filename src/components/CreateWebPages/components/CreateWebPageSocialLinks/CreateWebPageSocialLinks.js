import { Flex } from '@chakra-ui/react';

import { CustomSwitch } from '@/components/customSwitch/CustomSwitch';

import CreateWebPageLinks from '../../CreateOrEditLanding/LandingSteps/CreateWebPageLinks';

const CreateWebPageSocialLinks = ({
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
	isNew,
	isStreaming = false,
	isShop = false,
	mt = '32px',
}) => {
	return (
		<Flex mt={mt} flexDir='column' gap='24px'>
			<CustomSwitch
				w='100%'
				onChange={() => {
					setShowSocialLinks(!showSocialLinks);
				}}
				title={`Show ${isStreaming ? 'social' : ''} links on the ${isShop ? 'shop' : 'landing page'} `}
				id='123'
				isChecked={showSocialLinks}
				justify='space-between'
				pr='4px'
				fontWeight='400'
			/>

			{showSocialLinks && (
				<CreateWebPageLinks
					setValidLinks={setValidSocialLinks}
					validLinks={validSocialLinks}
					setLinks={setSocialLinks}
					links={socialLinks}
					invalidLinks={invalidSocialLinks}
					setInvalidLinks={setInvalidSocialLinks}
					socialLinksType={socialLinksType}
					setSocialLinksType={setSocialLinksType}
					isNew={isNew}
					isShop={isShop}
				/>
			)}
		</Flex>
	);
};

export default CreateWebPageSocialLinks;
