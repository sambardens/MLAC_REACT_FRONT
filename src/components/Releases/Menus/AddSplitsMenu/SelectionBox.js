import { Box, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import NextButton from '@/components/Buttons/NextButton/NextButton';

import CheckedRadioButtonIcon from '@/assets/icons/modal/checkedRadioButton.svg';
import RadioButtonIcon from '@/assets/icons/modal/radioButton.svg';

import EnteringMissingValuesModal from './EnteringMissingValuesModal';

const SelectionBox = ({ isCopyrightHolder, setIsCopyrightHolder, handleNext }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { phone, city, paymentEmail } = useSelector(state => state.user.user);
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		if (!phone || !city || !paymentEmail) {
			setIsModalOpen(true);
		} else {
			setIsLoading(true);
			await handleNext();
			setIsLoading(false);
		}
	};
	return (
		<Flex flexDir='column' justifyContent='space-between' h='100%'>
			<Box>
				<Stack mb='24px'>
					<Flex
						onClick={() => {
							setIsCopyrightHolder(false);
						}}
						px='12px'
						py='10px'
						border='1px solid'
						borderColor='stroke'
						borderRadius='10px'
						align='center'
					>
						<Icon as={!isCopyrightHolder ? CheckedRadioButtonIcon : RadioButtonIcon} boxSize='24px' />
						<Heading fontSize='16px' fontWeight='500' lineHeight='1.5' color='black' ml='12px' as='h3'>
							By creating a songwriting agreement all writers will automatically receive payment once they
							are Major Labl Artist Club members. You can invite them for free in the next step.
						</Heading>
					</Flex>
					<Flex
						onClick={() => {
							setIsCopyrightHolder(true);
						}}
						px='12px'
						py='10px'
						border='1px solid'
						borderColor='stroke'
						borderRadius='10px'
						align='center'
					>
						<Icon as={isCopyrightHolder ? CheckedRadioButtonIcon : RadioButtonIcon} boxSize='24px' />
						<Heading fontSize='16px' fontWeight='500' lineHeight='1.5' color='black' ml='12px' as='h3'>
							I am the only copyright holder and don&apos;t need to add songwriting splits.
						</Heading>
					</Flex>
				</Stack>
				<Text fontSize='16px' fontWeight='500' color='black'>
					Don&apos;t worry, if you choose not to create splits now, you can always create them later. But
					remember, if you decide not to create splits it&apos;s your responsibility to distribute
					royalties to writers manually.
				</Text>
			</Box>
			<NextButton onClickHandler={handleClick} isSubmiting={isLoading} />
			{isModalOpen && <EnteringMissingValuesModal setIsModalOpen={setIsModalOpen} />}
		</Flex>
	);
};

export default SelectionBox;
