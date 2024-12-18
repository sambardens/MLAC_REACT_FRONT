import { Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import getAccurateCartText from 'src/functions/utils/getAccurateCartText';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomModal from '@/components/Modals/CustomModal';

import LandingTrack from '../LandingTrack/LandingTrack';

const LandingCart = ({
	titleDesign,
	subTitleDesign,
	additionalDesign,
	handleOpenPayModal,
	onClose,
	totalPriceInCart,
	setLandingTracksList,
}) => {
	const { cart } = useSelector(state => state.landing);

	return (
		<CustomModal
			closeModal={onClose}
			maxH='90vh'
			w={{ base: '420px', lg: '480px' }}
			p='40px 0'
			right='6px'
			top='80px'
			bgColor={subTitleDesign?.hex}
			closeIconColor={titleDesign.hex}
			closeIconHoverColor={additionalDesign.hex}
		>
			<Flex justifyContent={'space-between'} alignItems={'center'} mb='32px' px='20px'>
				<Text
					// 	fontWeight={titleDesign.weight}
					// fontSize={titleDesign.size}
					fontWeight={500}
					fontSize='32px'
					fontFamily={titleDesign.font}
					fontStyle={titleDesign.italic ? 'italic' : 'initial'}
					color={titleDesign.hex}
				>
					Cart
				</Text>

				<Text
					fontWeight={500}
					fontSize='16px'
					// fontWeight={subTitleDesign.weight}
					// fontSize={subTitleDesign.size}
					fontFamily={subTitleDesign.font}
					fontStyle={subTitleDesign.italic ? 'italic' : 'initial'}
					color={titleDesign.hex}
				>
					{getAccurateCartText(cart.length)}
				</Text>
			</Flex>

			{cart.length > 0 && (
				<Flex
					flexDir='column'
					gap='16px'
					h='320px'
					maxH='320px'
					pl='20px'
					pr='10px'
					overflowY={'scroll'}
					css={{
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: additionalDesign.hex,
							borderRadius: '4px',
						},
					}}
				>
					{cart.map((track, index) => (
						<LandingTrack
							key={track.id}
							index={index}
							setLandingTracksList={setLandingTracksList}
							track={track}
							isLandingCart={true}
							titleDesign={titleDesign}
							subTitleDesign={subTitleDesign}
							additionalDesign={additionalDesign}
						/>
					))}
				</Flex>
			)}
			{cart.length === 0 && (
				<Flex h='416px' justifyContent={'center'} alignItems={'center'}>
					<Text
						fontWeight='400'
						fontSize='16px'
						// fontWeight={subTitleDesign.weight}
						// fontSize={subTitleDesign.size}
						color={titleDesign?.hex}
						fontFamily={subTitleDesign.font}
						fontStyle={subTitleDesign.italic ? 'italic' : 'initial'}
						maxW='250px'
						textAlign='center'
					>
						Please select a track or several tracks from the list
					</Text>
				</Flex>
			)}

			{cart.length > 0 && (
				<Flex
					justifyContent={'space-between'}
					mt='32px'
					px='20px'
					fontWeight={'600'}
					fontSize={'32px'}
					color={titleDesign?.hex}
				>
					£{totalPriceInCart}
					<CustomButton
						onClickHandler={handleOpenPayModal}
						bgColor={additionalDesign.hex}
						color={titleDesign.hex}
						fontFamily={additionalDesign.font}
						fontWeight={additionalDesign.weight}
						fontSize={additionalDesign.size}
						fontStyle={additionalDesign.italic === 'italic' ? 'italic' : 'initial'}
					>
						Checkout
					</CustomButton>
				</Flex>
			)}
		</CustomModal>
	);
};

export default LandingCart;
