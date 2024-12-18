import { Flex, Heading, Text } from '@chakra-ui/react';

import AuthLayout from '@/components/Layouts/AuthLayout';

const TermsOfUse = () => {
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
				Terms of Use
			</Heading>
			<Flex gap='8px' flexDir='column' px='40px'>
				<Text fontWeight='500' fontSize='16px' color='black'>
					Welcome to Major Labl application. By using our application, you agree to comply with and be
					bound by the following terms and conditions of use. Please read these terms carefully before
					using the application.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					1. The content of the pages of this application is for your general information and use only.
					It is subject to change without notice.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					2. Neither we nor any third parties provide any warranty or guarantee as to the accuracy,
					timeliness, performance, completeness, or suitability of the information and materials found or
					offered on this application for any particular purpose. You acknowledge that such information
					and materials may contain inaccuracies or errors and we expressly exclude liability for any
					such inaccuracies or errors to the fullest extent permitted by law.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					3. Your use of any information or materials on this application is entirely at your own risk,
					for which we shall not be liable. It shall be your own responsibility to ensure that any
					products, services, or information available through this application meet your specific
					requirements.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					4. This application contains material which is owned by or licensed to us. This material
					includes, but is not limited to, the design, layout, look, appearance, and graphics.
					Reproduction is prohibited other than in accordance with the copyright notice, which forms part
					of these terms and conditions.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					5. All trademarks reproduced in this application, which are not the property of, or licensed to
					the operator, are acknowledged on the application.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					6. Unauthorised use of this application may give rise to a claim for damages and/or be a
					criminal offence.
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					7. From time to time, this application may also include links to other applications. These
					links are provided for your convenience to provide further information. They do not signify
					that we endorse the application(s). We have no responsibility for the content of the linked
					application(s).
				</Text>
				<Text fontWeight='400' fontSize='16px' color='black'>
					8. Your use of this application and any dispute arising out of such use of the application is
					subject to the laws of UK or international laws, where applicable.
				</Text>
			</Flex>
		</AuthLayout>
	);
};

export default TermsOfUse;
