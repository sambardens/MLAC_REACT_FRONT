import { Flex, Icon, Text } from '@chakra-ui/react';

import SpotifyIcon from '@/assets/icons/social/spotify.svg';

import CustomButton from '../Buttons/CustomButton';
import CustomModal from '../Modals/CustomModal';

import { poppins_400_16_24, poppins_500_18_27, poppins_600_32_48 } from '@/styles/fontStyles';

export const ConfirmConnectToSpotify = ({ setCurrentModal }) => {
	return (
		<CustomModal closeOnOverlayClick={false} closeModal={() => setCurrentModal(0)}>
			<Flex flexDir={'column'} justifyContent={'space-between'} alignItems='start' h='100%'>
				<Flex flexDir={'column'} alignItems='start'>
					<Flex alignItems={'center'}>
						<Text color={'textColor.black'} sx={poppins_600_32_48} mr={'16px'}>
							Sync to Spotify
						</Text>
						<Icon as={SpotifyIcon} boxSize='32px' />
					</Flex>

					<Text color={'textColor.black'} sx={poppins_500_18_27} mt={'24px'}>
						Do you have spotify?
					</Text>

					<Text color={'textColor.gray'} sx={poppins_400_16_24} mt={'8px'}>
						Sync your data to quickly complete your B.A.P profile.
					</Text>
				</Flex>

				<Flex alignItems={'center'} justifyContent={'end'} mt={'24px'} w='100%' gap={'16px'}>
					<CustomButton styles={'main'} onClickHandler={() => setCurrentModal(5)} w={'150px'} h={'56px'}>
						Sync
					</CustomButton>
					<CustomButton
						styles={'light'}
						onClickHandler={() => setCurrentModal(null)}
						w={'150px'}
						h={'56px'}
					>
						Not now
					</CustomButton>
				</Flex>
			</Flex>
		</CustomModal>
	);
};
