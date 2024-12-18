import {
	Flex,
	Icon,
	Image,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Text,
} from '@chakra-ui/react';

import debounce from 'lodash.debounce';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, setSelectedRelease, setSelectedShopReleases } from 'store/shop/shop-slice';

import SliderBtnIcon from '@/assets/icons/base/slider-btn.svg';
import crossIcon from '@/assets/icons/shop/closeSmall.svg';
import gearIcon from '@/assets/icons/shop/gear.svg';

import { poppins_400_14_21 } from '@/styles/fontStyles';

const SelectedReleaseCard = ({ release, isCloseButton = true }) => {
	const dispatch = useDispatch();
	const selectedShopReleases = useSelector(state => state.shop.selectedShopReleases) || [];
	const { selectedRelease, cart } = useSelector(state => state.shop);

	const [backgroundBlur, setBlur] = useState(release?.backgroundBlur);
	const isEditing = selectedRelease?.id === release?.id;

	const setReleaseBgBlur = useRef(
		debounce(value => {
			const otherReleases = selectedShopReleases.filter(rel => rel.id !== release.id);
			const updatedRelease = { ...release, backgroundBlur: value };
			const releasesWithUpdatedRelease = [...otherReleases, updatedRelease];
			dispatch(setSelectedRelease(updatedRelease));
			dispatch(setSelectedShopReleases(releasesWithUpdatedRelease));
		}, 500),
	).current;

	const handleBlurChange = value => {
		setBlur(value);
		setReleaseBgBlur(value);
	};

	const removeReleaseFromList = () => {
		const updatedSelectedReleases = selectedShopReleases.filter(rel => rel.id !== release.id);
		dispatch(setSelectedShopReleases(updatedSelectedReleases));
		const updatedCartTracks = cart.filter(track => track.releaseId !== release.id);
		dispatch(setCart(updatedCartTracks));
		if (release.id === selectedRelease?.id) {
			dispatch(setSelectedRelease(null));
		}
	};

	const handleReleasePageOpen = () => {
		if (!isEditing) {
			dispatch(setSelectedRelease(release));
		}

		if (isEditing) {
			dispatch(setSelectedRelease(null));
		}
	};

	return (
		<Flex
			flexDir={'column'}
			h='fit-content'
			border={'1px solid red'}
			borderRadius='10px'
			borderColor={'bg.secondary'}
		>
			{isCloseButton && (
				<Flex justifyContent={'space-between'} h='80px' p='10px'>
					<Flex align='center'>
						<Image
							src={release.logoSrc}
							w='64px'
							h='64px'
							alt='release logo'
							borderRadius='8px'
							boxShadow='1px 1px 3px 1px Gray'
						/>
						<Flex flexDir={'column'} ml='12px'>
							<Text fontWeight={'400'} fontSize={'16px'}>
								{release.name}
							</Text>
							<Text mt='4px' fontWeight={'400'} fontSize={'14px'} color='secondary'>
								{release.formattedDate}
							</Text>
						</Flex>
					</Flex>

					<Flex alignItems={'center'}>
						<Icon
							onClick={handleReleasePageOpen}
							as={gearIcon}
							w='24px'
							h='24px'
							cursor='pointer'
							color={isEditing ? 'accent' : 'stroke'}
							_hover={{ color: 'accent' }}
							transition={'300ms'}
						/>

						<Icon
							onClick={removeReleaseFromList}
							as={crossIcon}
							ml='17px'
							w='14px'
							h='14px'
							cursor='pointer'
							color={'stroke'}
							_hover={{ color: 'accent' }}
							transition={'300ms'}
						/>
					</Flex>
				</Flex>
			)}

			{isEditing && (
				<Flex w='100%' h='80px' p='10px'>
					<Image
						src={release.logoSrc}
						w='64px'
						h='64px'
						borderRadius='8px'
						filter={`blur(${(0.64 * release?.backgroundBlur) / 20}px)`}
						alt='release logo'
					/>
					<Flex flexDir={'column'} ml='12px' w='100%'>
						<Flex justifyContent={'space-between'}>
							<Text color={'textColor.gray'} sx={poppins_400_14_21}>
								Background image blur
							</Text>
							<Text>{backgroundBlur}%</Text>
						</Flex>

						<Slider
							aria-label='slider-ex-2'
							defaultValue={backgroundBlur}
							onChange={e => handleBlurChange(e)}
							w='100%'
						>
							<SliderTrack bg='bg.secondary'>
								<SliderFilledTrack bg='accent' />
							</SliderTrack>
							<SliderThumb>
								<Icon as={SliderBtnIcon} boxSize='16px' />
							</SliderThumb>
						</Slider>
					</Flex>
				</Flex>
			)}
		</Flex>
	);
};

export default SelectedReleaseCard;
