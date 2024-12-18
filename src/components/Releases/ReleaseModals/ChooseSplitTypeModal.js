import { Box, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';

import { useDispatch } from 'react-redux';
import { setNewSplit, setReleaseScreen, setSplitTypeModalStatus } from 'store/slice';

import NextButton from '@/components/Buttons/NextButton/NextButton';
import CustomModal from '@/components/Modals/CustomModal';

import CheckedRadioButtonIcon from '@/assets/icons/modal/checkedRadioButton.svg';
import RadioButtonIcon from '@/assets/icons/modal/radioButton.svg';

const ChooseSplitTypeModal = ({ setWithContract, withContract }) => {
	const dispatch = useDispatch();
	const handleCreateSplit = () => {
		dispatch(setSplitTypeModalStatus(false));
		dispatch(setReleaseScreen('create-contract'));
		dispatch(setNewSplit(true));
	};
	return (
		<CustomModal
			closeModal={() => {
				dispatch(setSplitTypeModalStatus(false));
			}}
			maxW='594px'
		>
			<Heading fontSize='32px' fontWeight='600' mb='24px' color='black'>
				Contract or Splits
			</Heading>
			<Stack mb='24px'>
				<Flex
					onClick={() => {
						setWithContract(true);
					}}
					px='12px'
					py='10px'
					border='1px solid'
					borderColor='stroke'
					borderRadius='10px'
				>
					{withContract ? (
						<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
					) : (
						<Icon as={RadioButtonIcon} boxSize='24px' />
					)}

					<Box ml='12px'>
						<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
							Contract
						</Heading>
						<Text fontSize='14px' fontWeight='400' color='secondary'>
							Create a legally binding contract that requires a signature from each writer. We will
							automatically pay each writer their share of the agreed splits.
						</Text>
					</Box>
				</Flex>
				<Flex
					onClick={() => {
						setWithContract(false);
					}}
					px='12px'
					py='10px'
					border='1px solid'
					borderColor='stroke'
					borderRadius='10px'
				>
					{!withContract ? (
						<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
					) : (
						<Icon as={RadioButtonIcon} boxSize='24px' />
					)}
					<Box ml='12px'>
						<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
							Splits
						</Heading>
						<Text fontSize='14px' fontWeight='400' color='secondary'>
							Decide how much each writer should get paid and we&apos;ll pay them automatically. No need
							for any formal contract.
						</Text>
					</Box>
				</Flex>
			</Stack>
			<Flex>
				<NextButton onClickHandler={handleCreateSplit} />
			</Flex>
		</CustomModal>
	);
};

export default ChooseSplitTypeModal;
