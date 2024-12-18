import { Box, Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIsAddNewReleaseModal, setReleaseSelectedMenu } from 'store/slice';

import NextButton from '@/components/Buttons/NextButton/NextButton';
import CustomModal from '@/components/Modals/CustomModal';

import CheckedRadioButtonIcon from '@/assets/icons/modal/checkedRadioButton.svg';
import RadioButtonIcon from '@/assets/icons/modal/radioButton.svg';

const AddReleaseModal = ({ setIsExistingReleaseModal, handleNewRelease }) => {
	const [isExistingRelease, setIsExistingRelease] = useState(true);
	const dispatch = useDispatch();
	const handleNext = () => {
		if (!isExistingRelease) {
			handleNewRelease();
		} else {
			setIsExistingReleaseModal(true);
		}
		dispatch(setReleaseSelectedMenu(1));
		dispatch(setIsAddNewReleaseModal(false));
	};

	return (
		<CustomModal
			closeModal={() => {
				dispatch(setIsAddNewReleaseModal(false));
			}}
			maxW='594px'
		>
			<Heading fontSize='32px' fontWeight='600' mb='24px' color='black'>
				Add release
			</Heading>

			<Stack mb='24px'>
				<Flex
					onClick={() => {
						setIsExistingRelease(false);
					}}
					px='12px'
					py='10px'
					border='1px solid'
					borderColor='stroke'
					borderRadius='10px'
				>
					{!isExistingRelease ? (
						<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
					) : (
						<Icon as={RadioButtonIcon} boxSize='24px' />
					)}

					<Box ml='12px'>
						<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
							Add new release
						</Heading>
						<Text fontSize='14px' fontWeight='400' color='secondary'>
							Add your music to Major Labl Artist Club and we&apos;ll ensure you automatically get paid
							your fair share of streams and sales. <br />
							Once your music is on Major Labl, you will be able to distribute to over 100 music services,
							sell directly from your own free shop, create free landing pages and join our sync publishing
							catalogue to further monetise your music.
						</Text>
					</Box>
				</Flex>
				<Flex
					onClick={() => {
						setIsExistingRelease(true);
					}}
					px='12px'
					py='10px'
					border='1px solid'
					borderColor='stroke'
					borderRadius='10px'
				>
					{isExistingRelease ? (
						<Icon as={CheckedRadioButtonIcon} boxSize='24px' />
					) : (
						<Icon as={RadioButtonIcon} boxSize='24px' />
					)}
					<Box ml='12px'>
						<Heading mb='8px' fontSize='16px' fontWeight='500' lineHeight='1.5' color='black'>
							Add existing release
						</Heading>
						<Text fontSize='14px' fontWeight='400' color='secondary'>
							Add an existing release to Major Labl Artist Club to sell in your own shop, or promote via a
							customised landing page. You can also quickly and safely switch your music distribution to
							Major Labl Artist Club with no fear of lost streams.
						</Text>
					</Box>
				</Flex>
			</Stack>
			<Flex>
				<NextButton onClickHandler={handleNext} />
			</Flex>
		</CustomModal>
	);
};

export default AddReleaseModal;
