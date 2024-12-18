import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import AuthLayout from '@/components/Layouts/AuthLayout';

const PrivacyPolicy = () => {
	return (
		<AuthLayout footer={false}>
			<Heading
				fontWeight='600'
				fontSize='46px'
				color='black'
				textAlign='center'
				lineHeight='1.5'
				mb='40px'
			>
				Privacy Policy
			</Heading>
			<Flex gap='8px' flexDir='column' px='40px'>
				<Text fontWeight='500' fontSize='16px' color='black'>
					Your privacy is important to us. It is our policy to respect your privacy regarding any
					information we may collect from you across our application.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					1. We only ask for personal information when we truly need it to provide a service to you. We
					collect it by fair and lawful means, with your knowledge and consent.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					2. We store personal information for only as long as necessary to provide you with the
					requested service. What data we store, we&apos;ll protect within commercially acceptable means
					to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or
					modification.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					3. We don&apos;t share any personally identifying information publicly or with third-parties,
					except when required to by law.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					4. Our application may link to external sites that are not operated by us. Please be aware that
					we have no control over the content and practices of these sites and cannot accept
					responsibility or liability for their respective privacy policies.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					5. Your continued use of our application will be regarded as acceptance of our practices around
					privacy and personal information. If you have any questions about how we handle user data and
					personal information, feel free to contact us.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					6. This privacy policy is subject to change without notice. It was last updated on 05/31/2023.
				</Text>
			</Flex>
		</AuthLayout>
	);
};

export default PrivacyPolicy;
