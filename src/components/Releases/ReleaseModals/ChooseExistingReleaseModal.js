import { Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setIsAddFromSpotifyModal } from 'store/slice';

import CustomButton from '@/components/Buttons/CustomButton';
import NextButton from '@/components/Buttons/NextButton/NextButton';
import CustomModal from '@/components/Modals/CustomModal';

import CheckedRadioButtonIcon from '@/assets/icons/modal/checkedRadioButton.svg';
import RadioButtonIcon from '@/assets/icons/modal/radioButton.svg';
import SpotifyIconBtn from '@/assets/icons/social/spotify-small.svg';

import UploadOriginalAudioButton from '../UploadButtons/UploadOriginalAudioButton';

const ChooseExistingReleaseModal = ({
	setIsExistingReleaseModal,
	handleNewRelease,
	setIsSyncSpotifyModal,
}) => {
	const { selectedBap } = useSelector(state => state.user);
	const [isSpotifyWay, setIsSpotifyWay] = useState(false);
	const dispatch = useDispatch();
	const handleNext = () => {
		if (isSpotifyWay) {
			dispatch(setIsAddFromSpotifyModal(true));
		} else {
			setIsUploadOriginalAudioModal(true);
		}
		setIsExistingReleaseModal(false);
	};

	const handleOpenSyncSpotifyModal = () => {
		setIsSyncSpotifyModal(true);
		setIsExistingReleaseModal(false);
	};
	return (
		<CustomModal
			closeModal={() => {
				setIsExistingReleaseModal(false);
			}}
			maxW='594px'
		>
			<Heading fontSize='24px' fontWeight='600' mb='24px' color='black' textAlign='center'>
				You can add an existing release to Major Labl Artist Club in two ways.
			</Heading>

			<Stack mb='24px'>
				<Flex
					onClick={() => {
						setIsSpotifyWay(false);
					}}
					px='12px'
					py='15px'
					border='1px solid'
					borderColor='stroke'
					borderRadius='10px'
				>
					<Icon as={!isSpotifyWay ? CheckedRadioButtonIcon : RadioButtonIcon} boxSize='24px' />
					<Heading fontSize='16px' fontWeight='500' lineHeight='1.5' color='black' ml='12px'>
						Upload original audio file
					</Heading>
				</Flex>
				<Flex
					onClick={() => {
						setIsSpotifyWay(true);
					}}
					px='12px'
					py='15px'
					border='1px solid'
					borderColor='stroke'
					borderRadius='10px'
				>
					<Icon as={isSpotifyWay ? CheckedRadioButtonIcon : RadioButtonIcon} boxSize='24px' />
					<Heading fontSize='16px' fontWeight='500' lineHeight='1.5' color='black' ml='12px'>
						Add existing release from Spotify
					</Heading>
				</Flex>
			</Stack>
			<Flex>
				{!selectedBap?.spotifyId && (
					<CustomButton
						onClickHandler={handleOpenSyncSpotifyModal}
						iconRight={SpotifyIconBtn}
						w='213px'
						styles={'transparent-bold'}
					>
						<Text>Sync with Spotify</Text>
					</CustomButton>
				)}
				{isSpotifyWay ? (
					<NextButton
						onClickHandler={handleNext}
						styles={selectedBap?.spotifyId ? 'main' : 'disabled'}
					/>
				) : (
					<UploadOriginalAudioButton handleNewRelease={handleNewRelease} />
				)}
			</Flex>
		</CustomModal>
	);
};

export default ChooseExistingReleaseModal;
