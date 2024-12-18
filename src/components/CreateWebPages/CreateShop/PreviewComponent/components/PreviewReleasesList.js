import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import ArrowLeftIcon from '@/assets/icons/shop/releaseArrowLeft.svg';
import ArrowRightIcon from '@/assets/icons/shop/releaseArrowRight.svg';

import PreviewReleaseCard from './PreviewReleaseCard';

const PreviewReleasesList = () => {
	const selectedBap = useSelector(state => state.user.selectedBap);
	const selectedShopReleases = useSelector(state => state.shop.selectedShopReleases);
	const shop = useSelector(state => state.shop);

	// ---------------------- SLIDER ----------------------
	const [isPrevDisabled, setIsPrevDisabled] = useState(true);
	const [isNextDisabled, setIsNextDisabled] = useState(true);
	const maxScrollWidth = useRef(0);
	const [currentIndex, setCurrentIndex] = useState(0);

	const carousel = useRef(null);

	const length = selectedShopReleases?.length;

	useEffect(() => {
		if (carousel !== null && carousel.current !== null) {
			carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
		}
	}, [currentIndex]);

	useEffect(() => {
		maxScrollWidth.current = carousel.current
			? carousel.current.scrollWidth - carousel.current.offsetWidth
			: 0;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [carousel.current, carousel.current?.scrollWidth, carousel.current?.offsetWidth, length]);

	const movePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(prevState => prevState - 1);
		}
	};

	const moveNext = () => {
		if (
			carousel.current !== null &&
			carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
		) {
			setCurrentIndex(prevState => prevState + 1);
		}
	};

	useEffect(() => {
		const isDisabled = direction => {
			if (direction === 'prev') {
				return currentIndex <= 0;
			}
			if (direction === 'next' && carousel.current !== null) {
				return carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current;
			}

			return false;
		};

		setIsNextDisabled(isDisabled('next'));
		setIsPrevDisabled(isDisabled('prev'));
	}, [maxScrollWidth, carousel?.current?.offsetWidth, currentIndex, length]);

	// -----------------------------------------------------

	const [titleColor, setTitleColor] = useState(null);
	const [fontForTitle, fontForSubtitle, fontForBody] = shop?.fonts || [];

	useEffect(() => {
		if (shop?.palette?.colors) {
			const selectedTitleColor = Object.values(shop.palette.colors)[1] || 'white';
			setTitleColor(selectedTitleColor);
		}
	}, [shop]);

	return (
		<Flex
			position={'absolute'}
			flexDir={'column'}
			justifyContent={'center'}
			alignItems={'center'}
			top='50%'
			right='50%'
			transform='translate(50%, -50%)'
		>
			<Text
				fontFamily={shop.selectedFonts[0].font}
				fontStyle={shop.selectedFonts[0].italic}
				fontWeight={shop.selectedFonts[0].weight}
				fontSize={shop.selectedFonts[0].size}
				color={shop.selectedPalette?.colors[0]}
				mb='40px'
			>
				{selectedBap?.bapName}
			</Text>
			<Box pos='relative'>
				{length > 0 && (
					<>
						{length > 3 && !isPrevDisabled && (
							<Flex
								onClick={movePrev}
								cursor='pointer'
								pos='absolute'
								top='50%'
								transform='translateY(-50%)'
								left='-80px'
							>
								<Icon as={ArrowLeftIcon} w='48px' height='48px' color={shop.selectedPalette?.colors[1]} />
							</Flex>
						)}

						<Flex
							as='ul'
							gap='12px'
							align='center'
							justify={length < 3 ? 'center' : 'initial'}
							overflow={'hidden'}
							w='624px'
							ref={carousel}
							scrollBehavior={'smooth'}
						>
							{selectedShopReleases.map(rel => (
								<PreviewReleaseCard
									key={rel.id}
									rel={rel}
									fontForSubtitle={fontForSubtitle}
									fontForBody={fontForBody}
								/>
							))}
						</Flex>

						{length > 3 && !isNextDisabled && (
							<Flex
								onClick={moveNext}
								cursor='pointer'
								pos='absolute'
								top='50%'
								transform='translateY(-50%)'
								right='-80px'
							>
								<Icon as={ArrowRightIcon} w='48px' height='48px' color={shop.selectedPalette?.colors[1]} />
							</Flex>
						)}
					</>
				)}

				{length < 1 && (
					<Flex mt='40px' gap='10px'>
						<Text color={shop.selectedPalette?.colors[0]}>There are no releases in this shop yet</Text>
					</Flex>
				)}
			</Box>
		</Flex>
	);
};

export default PreviewReleasesList;
