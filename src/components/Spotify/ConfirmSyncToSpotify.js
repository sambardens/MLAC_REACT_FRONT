import { Checkbox, Flex, Text } from '@chakra-ui/react';

import CustomButton from '../Buttons/CustomButton';

import ArtistCard from './components/ArtistCard';
import { poppins_400_16_24, poppins_500_16_24 } from '@/styles/fontStyles';

export const ConfirmSyncToSpotify = ({
	setIsConfirmButton,
	selectedArtist,
	setSelectedArtist,
	pullDataFromSpotify,
	isConfirmButton,
	isLoading,
}) => {
	return (
		<>
			<Flex flexDir={'column'} mt='24px'>
				<Text color={'textColor.black'} sx={poppins_500_16_24}>
					Confirm
				</Text>

				<Text color={'textColor.gray'} sx={poppins_400_16_24} my={'24px'}>
					You should only add bands, artists or projects that you own or have permission to act on behalf
					of. Adding artists without permission will lead to your suspension or removal from Major Labl
					Artist Club.
				</Text>

				<ArtistCard
					artist={selectedArtist}
					mb='20px'
					imgWidth={'120px'}
					imgHeight={'120px'}
					confirmSync={true}
					height={'120px'}
				/>

				<Flex alignItems={'center'} justifyContent={'space-between'}>
					<Flex>
						<Checkbox
							id='confirm_sync'
							ml='2px'
							size='lg'
							iconColor={'white'}
							colorScheme={'checkbox'}
							borderColor={'checkbox.500'}
							rounded='md'
							onChange={e => {
								setIsConfirmButton(e.target.checked);
							}}
						/>

						<Text color={'textColor.black'} sx={poppins_400_16_24} maxWidth={'252px'} ml={'10px'}>
							I declare that I am a member of this band, artist or project
						</Text>
					</Flex>
					<Flex alignItems={'center'} gap={'16px'}>
						<CustomButton
							styles={isConfirmButton ? 'main' : 'disabled'}
							onClickHandler={pullDataFromSpotify}
							w={'150px'}
							h={'56px'}
							isSubmiting={isLoading}
						>
							Sync
						</CustomButton>

						<CustomButton
							styles={'light'}
							onClickHandler={() => {
								setSelectedArtist(null);
							}}
							w={'150px'}
							h={'56px'}
						>
							Cancel
						</CustomButton>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
};
