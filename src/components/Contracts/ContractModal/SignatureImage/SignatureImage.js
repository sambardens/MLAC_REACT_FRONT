import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import SignatureCanvas from 'react-signature-canvas';

import CustomButton from '@/components/Buttons/CustomButton';

import ClearIcon from '@/assets/icons/base/clear.svg';

import s from './SignatureImage.module.css';

const SignatureImage = ({
	canvasRef,
	handleSignature,
	setSignatureField,
	isSignatureBtn,
	isLoading,
}) => {
	const handleClear = () => {
		canvasRef.current.clear();
	};
	return (
		<>
			<Box p='8px' bg='bg.secondary' w='100%' height='150px' borderRadius='10px' pos='relative'>
				<SignatureCanvas ref={canvasRef} penColor='black' canvasProps={{ className: `${s.canvas}` }} />
				<Text
					color='secondary'
					fontSize='16px'
					fontWeight='400'
					pos='absolute'
					left='8px'
					top='8px'
					pointerEvents='none'
				>
					Sign in this space
				</Text>
				<Flex
					as='button'
					alignItems='center'
					pos='absolute'
					right='8px'
					top='8px'
					onClick={handleClear}
				>
					<Icon as={ClearIcon} mr='8px' w='24px' h='24px' />
					<Text fontSize='16px' fontWeight='400' color='secondary'>
						Clear
					</Text>
				</Flex>
			</Box>
			<Flex justify='flex-end'>
				{isSignatureBtn && (
					<CustomButton styles='main' onClickHandler={handleSignature} isSubmiting={isLoading}>
						Save
					</CustomButton>
				)}
				<CustomButton
					styles='trasparent'
					onClickHandler={() => {
						setSignatureField(false);
					}}
					ml='16px'
				>
					Cancel
				</CustomButton>
			</Flex>
		</>
	);
};

export default SignatureImage;
