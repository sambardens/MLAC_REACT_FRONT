import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import ArrowLeftIcon from '@/assets/icons/shop/releaseArrowLeft.svg';
import ArrowRightIcon from '@/assets/icons/shop/releaseArrowRight.svg';

import ReleaseCard from './ReleaseCard';

const ReleasesList = () => {
	const { selectedBap } = useSelector(state => state.user);

	const shopUser = useSelector(state => state.shopUser);
	const { selectedShopReleases, bapName } = shopUser;
	const [titleColor, setTitleColor] = useState(null);
	const [fontForTitle, fontForSubtitle, fontForBody] = shopUser?.fonts || [];

	useEffect(() => {
		if (shopUser?.palette?.colors) {
			const selectedTitleColor = Object.values(shopUser.palette.colors)[1] || 'white';
			setTitleColor(selectedTitleColor);
		}
	}, [shopUser]);

	// ---------------------- SLIDER ----------------------
	const [isPrevDisabled, setIsPrevDisabled] = useState(true);
	const [isNextDisabled, setIsNextDisabled] = useState(true);
	const maxScrollWidth = useRef(0);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isJustifyCenter, setIsJustifyCenter] = useState(false);
	const carousel = useRef(null);
	const releasesRef = useRef(null);

	const length = selectedShopReleases?.length;
	const boxWidth = length ? length * 240 + (length - 1) * 12 : 0;

	useEffect(() => {
		const checkWidthSliderBox = () => {
			if (boxWidth < releasesRef?.current?.clientWidth) {
				return setIsJustifyCenter(true);
			}
			return setIsJustifyCenter(false);
		};
		if (releasesRef.current) {
			checkWidthSliderBox();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (carousel !== null && carousel.current !== null) {
			carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
		}
	}, [currentIndex]);

	useEffect(() => {
		maxScrollWidth.current = carousel.current
			? carousel.current.scrollWidth - carousel.current.offsetWidth
			: 0;
	}, []);

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
	}, [maxScrollWidth, carousel, currentIndex]);

	// -----------------------------------------------------

	return (
		<Flex
			pos={{ base: 'relative', lg: 'absolute' }}
			mt={{ base: '120px', lg: '0' }}
			flexDir='column'
			justify='center'
			align='center'
			top={{
				base: 'initial',
				lg: 'calc(50% + 40px)',
			}}
			right={{ base: 'initial', lg: '50%' }}
			transform={{ base: 'none', lg: 'translate(50%, -50%)' }}
		>
			<Text
				pos={{ base: 'relative', lg: 'absolute' }}
				top={{
					base: 'initial',
					lg: '0',
				}}
				right={{ base: 'initial', lg: '50%' }}
				transform={{ base: 'none', lg: 'translate(50%, -180%)' }}
				fontFamily={shopUser.selectedFonts[0].font}
				fontStyle={shopUser.selectedFonts[0].italic}
				fontWeight={shopUser.selectedFonts[0].weight}
				fontSize={shopUser.selectedFonts[0].size}
				color={shopUser.selectedPalette?.colors[0]}
				mb={{ base: '40px', lg: 0 }}
			>
				{bapName}
			</Text>

			{length > 0 ? (
				<Box pos='relative'>
					{length > 3 && !isPrevDisabled && (
						<Flex
							onClick={movePrev}
							cursor='pointer'
							pos='absolute'
							top='50%'
							transform='translateY(-50%)'
							left='-80px'
							display={{ base: 'none', lg: 'initial' }}
							height='48px'
						>
							<Icon
								as={ArrowLeftIcon}
								w='48px'
								height='48px'
								color={shopUser.selectedPalette?.colors[1]}
							/>
						</Flex>
					)}
					<Flex
						as='ul'
						justify={length < 3 ? 'center' : 'initial'}
						ref={carousel}
						scrollBehavior={'smooth'}
						gap='24px'
						flexDir={{ base: 'column', lg: 'row' }}
						w={{ base: '360px', lg: '948px' }}
						overflow={{ base: 'auto', lg: 'hidden' }}
					>
						{selectedShopReleases.map(rel => (
							<ReleaseCard
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
							display={{ base: 'none', lg: 'initial' }}
							height='48px'
						>
							<Icon
								as={ArrowRightIcon}
								w='48px'
								height='48px'
								color={shopUser.selectedPalette?.colors[1]}
							/>
						</Flex>
					)}
				</Box>
			) : (
				<Text mt='40px' color={shopUser.selectedPalette?.colors[0]} fontSize='18px'>
					There are no releases in this shop yet
				</Text>
			)}
		</Flex>
	);
};

export default ReleasesList;
