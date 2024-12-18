import { useRouter } from 'next/router';

import { Box, Flex, Heading, Icon, Stack, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLandingPage } from 'store/slice';

import NextButton from '@/components/Buttons/NextButton/NextButton';
import CustomModal from '@/components/Modals/CustomModal';

import CheckedRadioButtonIcon from '@/assets/icons/modal/checkedRadioButton.svg';
import RadioButtonIcon from '@/assets/icons/modal/radioButton.svg';

const CreateWebPageModal = ({ setCurrentStep }) => {
	const selectedBap = useSelector(state => state.user.selectedBap);
	const { push } = useRouter();
	const [isShop, setIsShop] = useState(selectedBap?.shops?.length === 0);
	const dispatch = useDispatch();
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const handleCreatingShop = async () => {
		setIsLoading(true);
		try {
			await push({
				pathname: '/bap/[bapId]/web-pages/create-shop',
				query: { bapId: selectedBap?.bapId },
			});
		} catch (error) {
			console.error('Error during navigation:', error);
		}
		setIsLoading(false);
	};
	const handleNext = () => {
		if (isShop) {
			handleCreatingShop();
		} else {
			setCurrentStep(2);
			dispatch(setLandingPage(null));
		}
	};

	const handleSelect = () => {
		if (!isShop && selectedBap?.shops?.length === 1) {
			toast({
				position: 'top',
				title: 'Attention',
				description: 'You already have a shop',
				status: 'info',
				duration: 5000,
				isClosable: true,
			});
		} else {
			setIsShop(!isShop);
		}
	};
	return (
		<CustomModal
			closeModal={() => setCurrentStep(null)}
			maxW='594px'
			maxH='90vh'
			w='80vw'
			p='40px 26px 40px 40px'
		>
			<Box pr='14px'>
				<Heading as='h3' fontSize='32px' fontWeight='600' lineHeight='1.5'>
					Create a web page
				</Heading>

				<Box mt='8px'>
					<Text fontSize='16px' fontWeight='400' color='secondary'>
						Choose the type of web page
					</Text>
				</Box>
			</Box>

			<Stack mt='24px' overflowY='scroll' maxH='calc(90vh - 339px)' pr='8px'>
				<Flex
					onClick={handleSelect}
					px='12px'
					py='10px'
					border='1px solid'
					borderColor='stroke'
					borderRadius='10px'
					cursor='pointer'
				>
					{isShop ? (
						<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
					) : (
						<Icon as={RadioButtonIcon} boxSize='24px' />
					)}

					<Box ml='12px'>
						<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
							Shop
						</Heading>
						<Text fontSize='14px' fontWeight='400' color='secondary'>
							The shop can contain several releases at once
						</Text>
					</Box>
				</Flex>

				<Flex
					onClick={handleSelect}
					px='12px'
					py='10px'
					border='1px solid'
					borderColor='stroke'
					borderRadius='10px'
					cursor='pointer'
				>
					{!isShop ? (
						<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
					) : (
						<Icon as={RadioButtonIcon} boxSize='24px' />
					)}
					<Box ml='12px'>
						<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
							Landing page
						</Heading>
						<Text fontSize='14px' fontWeight='400' color='secondary'>
							Landing page for one release
						</Text>
					</Box>
				</Flex>
			</Stack>

			<Flex mt='24px' justify='end'>
				<NextButton onClickHandler={handleNext} isSubmiting={isLoading} />
			</Flex>
		</CustomModal>
	);
};

export default CreateWebPageModal;
