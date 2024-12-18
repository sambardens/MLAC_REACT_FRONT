import { useRouter } from 'next/router';

import { Box, Button, Flex, Image, Text, Tooltip } from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadsSelectors } from 'store/downloads';
import { setCurrentArtist, setCurrentRelease } from 'store/downloads/downloads-slice';

import PlusButton from '@/components/Buttons/PlusButton/PlusButton';

import ArrowLeftIcon from '@/assets/icons/downloads/arrowLeft.svg';
import ArrowRightIcon from '@/assets/icons/downloads/arrowRight.svg';

import ReleaseSkeleton from './skeletons/ReleaseSkeleton';
import { poppins_400_16_24, poppins_500_18_27, poppins_600_32_48 } from '@/styles/fontStyles';

export const Releases = ({
	jc = 'center',
	handleOpenRelease,
	addReleaseHandler,
	isLoading = false,
}) => {
	const dispatch = useDispatch();
	const maxScrollWidth = useRef(0);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isJustifyCenter, setIsJustifyCenter] = useState(null);
	const carousel = useRef(null);
	const releasesRef = useRef(null);
	const orderReleases = useSelector(downloadsSelectors.getOrderReleases);
	const currentRelease = useSelector(downloadsSelectors.getCurrentRelease);
	const isLoadingData = useSelector(downloadsSelectors.getIsLoading);
	const router = useRouter();
	const isDashboardPage = router.pathname.includes('/dashboard');
	const { selectedBap, isLoading: isReduxLoading } = useSelector(state => state.user);
	const releases = isDashboardPage ? selectedBap?.releases : orderReleases || [];
	const boxWidth = releases?.length ? releases?.length * 200 + (releases?.length - 1) * 16 : 0;

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
	}, [selectedBap?.bapId, boxWidth]);

	useEffect(() => {
		if (carousel !== null && carousel.current !== null) {
			carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
		}
	}, [currentIndex]);

	useEffect(() => {
		if (currentIndex === 0) {
			maxScrollWidth.current = carousel.current
				? carousel.current.scrollWidth - carousel.current.offsetWidth
				: 0;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		currentIndex,
		carousel.current,
		carousel.current?.offsetWidth,
		carousel.current?.scrollWidth,
		selectedBap?.bapId,
	]);

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

	const handleOnError = e => {
		e.target.src = '/assets/images/mockImg/rectangle_3.jpg';
	};

	const handleChooseRelease = itemRelease => {
		if (isDashboardPage) {
			handleOpenRelease(itemRelease?.id);
		} else {
			dispatch(
				setCurrentRelease(currentRelease?.releaseId === itemRelease.releaseId ? null : itemRelease),
			);
			dispatch(setCurrentArtist(null));
		}
	};

	const isNextDisabled =
		(carousel.current?.offsetWidth || 0) * currentIndex >= maxScrollWidth.current;
	const isPrevDisabled = currentIndex <= 0;

	useEffect(() => {
		setCurrentIndex(0);
	}, [selectedBap?.bapId]);

	const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
	return (
		<Box p={'24px'} bg={'bg.main'} borderRadius={'20px'} position='relative' ref={releasesRef}>
			<Flex alignItems={'center'} justifyContent={'space-between'}>
				<Text as={'h2'} sx={poppins_600_32_48} color={'textColor.black'}>
					Releases
				</Text>
				{isDashboardPage && creatorOrAdmin && (
					<PlusButton title='Add release' onClickHandler={addReleaseHandler} />
				)}
				{!isDashboardPage && (
					<Flex alignItems={'center'} gap={'8px'}>
						<Button variant={'unstyled'} onClick={movePrev} isDisabled={isPrevDisabled}>
							<ArrowLeftIcon />
						</Button>
						<Button variant={'unstyled'} onClick={moveNext} isDisabled={isNextDisabled}>
							<ArrowRightIcon />
						</Button>
					</Flex>
				)}
			</Flex>

			{isLoadingData && <ReleaseSkeleton />}
			{releases?.length > 0 ? (
				<Flex
					as='ul'
					alignItems={'center'}
					justifyContent={!isJustifyCenter ? 'inherit' : { jc }}
					overflow={'hidden'}
					w={'100%'}
					ref={carousel}
					scrollBehavior={'smooth'}
					mt={'24px'}
					gap='16px'
				>
					{releases?.map((itemRelease, index) => {
						const isCurrent =
							(itemRelease?.id || itemRelease?.releaseId) ===
							(currentRelease?.id || currentRelease?.releaseId);
						return (
							<Box
								as='li'
								key={itemRelease?.id || itemRelease.releaseId}
								cursor={'pointer'}
								onClick={() => handleChooseRelease(itemRelease)}
								w={'200px'}
								pos='relative'

								// h={'270px'}
								// pl={ index === 0 && !isJustifyCenter ? '0px' : index === 0 && isJustifyCenter ? '16px' : '16px'}
							>
								<Image
									src={
										itemRelease?.url || itemRelease?.logoMin || itemRelease?.logo || itemRelease?.releaseLogo
									}
									alt='release artwork'
									width={'100%'}
									height={'183px'}
									borderRadius={'20px'}
									objectFit={'cover'}
									border={isDashboardPage ? 0 : '4px'}
									borderColor={isCurrent ? 'bg.red' : 'transparent'}
									_hover={
										isDashboardPage && {
											boxShadow: '0px 2px 4px 2px  rgba(0, 0, 0, 0.2)',
										}
									}
									onError={e => handleOnError(e)}
								/>
								<Box px={'6px'} pb={'6px'} mt={'24px'}>
									<Tooltip
										hasArrow
										label={itemRelease?.name?.length > 17 && itemRelease?.name}
										placement='auto'
										bg='bg.black'
										color='textColor.white'
										fontSize='16px'
										borderRadius={'5px'}
									>
										<Text
											width={'190px'}
											overflow={'hidden'}
											textOverflow={'ellipsis'}
											whiteSpace='nowrap'
											sx={poppins_500_18_27}
											color={
												(itemRelease?.id || itemRelease?.releaseId) ===
												(currentRelease?.id || currentRelease?.releaseId)
													? 'bg.red'
													: 'textColor.black'
											}
										>
											{itemRelease?.name || itemRelease?.releaseName}
										</Text>
									</Tooltip>

									<Tooltip
										hasArrow
										label={itemRelease?.band?.length > 17 && itemRelease?.band}
										placement='auto'
										bg='bg.black'
										color='textColor.white'
										fontSize='16px'
										borderRadius={'5px'}
									>
										<Text
											sx={poppins_400_16_24}
											color={'textColor.gray'}
											mt={'4px'}
											width={'190px'}
											overflow={'hidden'}
											textOverflow={'ellipsis'}
											whiteSpace='nowrap'
										>
											{itemRelease?.band || selectedBap?.bapName || itemRelease?.bapName}
										</Text>
									</Tooltip>
								</Box>
								{itemRelease.isDuplicate && (
									<Text
										position={'absolute'}
										top='12px'
										right='16px'
										px='8px'
										py='4px'
										bg={'accent'}
										fontWeight={'400'}
										fontSize={'14px'}
										color='white'
										borderRadius={'31px'}
										pointerEvents='none'
									>
										duplicate
									</Text>
								)}
							</Box>
						);
					})}
				</Flex>
			) : (
				<>
					{!isLoadingData && (
						<Flex align='center' justify='center' h='292px'>
							{!isLoading && !isReduxLoading && (
								<Text color={'secondary'}>
									{isDashboardPage
										? 'You don’t have any releases in this B.A.P. Add a release to get started.'
										: 'There are no releases'}
								</Text>
							)}
						</Flex>
					)}
				</>
			)}
			{isDashboardPage && (
				<Flex justifyContent={'end'}>
					<Flex alignItems={'center'} gap={'8px'}>
						<Button variant={'unstyled'} onClick={movePrev} isDisabled={isPrevDisabled}>
							<ArrowLeftIcon />
						</Button>
						<Button variant={'unstyled'} onClick={moveNext} isDisabled={isNextDisabled}>
							<ArrowRightIcon />
						</Button>
					</Flex>
				</Flex>
			)}
		</Box>
	);
};
