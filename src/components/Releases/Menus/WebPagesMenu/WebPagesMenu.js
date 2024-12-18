import { useRouter } from 'next/router';

import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLandingPagesByBapId, getShopsByBapId } from 'store/operations';
import { setShop } from 'store/shop/shop-slice';
import { setUserShop } from 'store/shop/shop-user-slice';
import { setLandingPage, setReleaseSelectedMenu } from 'store/slice';

import WebPagesCard from '@/components/CreateWebPages/components/WebPagesCard/WebPagesCard';
import CustomInput from '@/components/CustomInputs/CustomInput';
import СreateLandingPageModalStepOne from '@/components/Modals/СreateLandingPageModal/СreateLandingPageModalStepOne';
import СreateLandingPageModalStepTwo from '@/components/Modals/СreateLandingPageModal/СreateLandingPageModalStepTwo';

import SearchIcon from '@/assets/icons/base/search.svg';

import MenuTitle from '../MenuTitle/MenuTitle';

import CreateCard from './CreateCard/CreateCard';

const WebPagesMenu = ({ setIsStartPage, isDealsMenuValid }) => {
	const [isStepOneModal, setIsStepOneModal] = useState(false);
	const [isStepTwoModal, setIsStepTwoModal] = useState(false);
	const { selectedBap, selectedRelease, isLoading } = useSelector(state => state.user);
	const isSpotifyRelease = selectedRelease?.releaseSpotifyId;
	const dispatch = useDispatch();
	const [searchValue, setSearchValue] = useState('');
	const normalizedFilterValue = searchValue?.toLowerCase().trim();
	const { pathname, push } = useRouter();
	const isOnlyStreaming = isSpotifyRelease && selectedRelease.splitsAndContracts?.length === 0;
	const handleChange = e => {
		setSearchValue(e.target.value);
	};
	const closeModal = () => {
		setIsStepOneModal(false);
		setIsStepTwoModal(false);
	};
	const openStepOneModal = () => {
		setIsStepOneModal(true);
		setIsStepTwoModal(false);
	};
	const openStepTwoModal = () => {
		setIsStepOneModal(false);
		setIsStepTwoModal(true);
	};
	const isReleasePage = pathname.includes('/releases');
	const isWebPages = pathname.includes('/web-pages');

	const handleCreateLandingPage = () => {
		dispatch(setLandingPage(null));
		// if (selectedRelease?.landingPages?.length === 0) {
		// 	toast({
		// 		position: 'top',
		// 		title: 'Attention',
		// 		description: 'Once the landing page is created, you will not be able to upload new tracks.',
		// 		status: 'info',
		// 		duration: 9000,
		// 		isClosable: true,
		// 	});
		// }

		if (isReleasePage) {
			if (!isDealsMenuValid) {
				push({
					pathname: '/bap/[bapId]/releases/[releaseId]/create-streaming-landing',
					query: { bapId: selectedBap?.bapId, releaseId: selectedRelease?.id },
				});
			} else {
				openStepTwoModal();
			}
		} else {
			openStepOneModal();
		}
	};

	const handleNext = () => {
		if (isOnlyStreaming) {
			if (pathname === '/bap/[bapId]/releases/[releaseId]') {
				push({
					pathname: '/bap/[bapId]/releases',
					query: { bapId: selectedBap?.bapId },
				});
			} else {
				setIsStartPage(true);
			}
		} else {
			dispatch(setReleaseSelectedMenu(7));
		}
	};

	const handleCreatingShop = async () => {
		dispatch(setShop(null));

		push({
			pathname: '/bap/[bapId]/web-pages/create-shop',
			query: { bapId: selectedBap?.bapId },
		});
	};

	useEffect(() => {
		if (isWebPages && selectedBap?.bapId) {
			dispatch(getLandingPagesByBapId(selectedBap?.bapId));
			dispatch(getShopsByBapId(selectedBap?.bapId));
			dispatch(setUserShop(null));
		}
	}, [dispatch, isWebPages, selectedBap?.bapId]);

	const getActualWebPages = type => {
		let webpages;
		if (type === 'landing') {
			webpages = isReleasePage ? selectedRelease?.landingPages : selectedBap?.landingPages;
		} else {
			webpages = selectedBap?.shops;
		}
		const filteredWebPages = normalizedFilterValue
			? webpages?.filter(el => el.name.toLowerCase().includes(normalizedFilterValue))
			: webpages;
		const sortedWebPages =
			filteredWebPages?.length > 0 ? [...filteredWebPages]?.sort((a, b) => b.id - a.id) : [];

		return sortedWebPages;
	};
	const landingPages = getActualWebPages('landing');
	const shops = getActualWebPages('shop');
	const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;
	const canAdd = creatorOrAdmin && selectedBap.releases?.length > 0;

	return (
		<>
			<Flex flexDir='column' justify='space-between' h='100%'>
				<Box>
					{isReleasePage && (
						<MenuTitle
							title={isOnlyStreaming ? 'Add landing pages' : 'Add web pages'}
							text={
								isOnlyStreaming
									? 'Create a landing page with streaming links for this release'
									: 'Create a web page for this release'
							}
						/>
					)}
					{!isReleasePage && (landingPages.length > 0 || selectedBap?.shops?.length > 0) && (
						<CustomInput
							icon={SearchIcon}
							maxW='350px'
							mr='10px'
							placeholder='Search'
							value={searchValue}
							onChange={handleChange}
							mb='16px'
							name='searchValue'
						/>
					)}
					<>
						{selectedBap?.shops?.length > 0 ? (
							<>
								{isReleasePage ? (
									<Heading
										as='h4'
										px='12px'
										mt='8px'
										fontSize='12px'
										fontWeight='500'
										color='secondary'
										mb='8px'
									>
										Your shop
									</Heading>
								) : (
									<>
										{shops?.length > 0 && (
											<Heading
												as='h4'
												px='12px'
												mt='16px'
												fontSize='18px'
												fontWeight='600'
												color='black'
												mb='8px'
											>
												Your shop
											</Heading>
										)}
									</>
								)}

								{shops.map(shop => {
									return (
										<WebPagesCard
											key={shop.name}
											web={shop}
											webType={'shop'}
											alt='Web shop image'
											h={isReleasePage ? '120px' : '145px'}
										/>
									);
								})}
							</>
						) : (
							<>
								{canAdd && !isOnlyStreaming && (
									<CreateCard
										title='Create shop'
										text={
											isWebPages
												? 'Create a free shop to sell your releases directly.  Major Labl takes 10% commission on shop sales vs 18% on Bandcamp. Upgrade and become a Major Labl member to keep 100% of sales revenue.'
												: 'Create a free shop to sell a release directly in seconds'
										}
										onClickHandler={handleCreatingShop}
										h={isReleasePage ? '120px' : '145px'}
									/>
								)}
							</>
						)}
					</>

					{landingPages?.length > 0 && (
						<>
							{isReleasePage ? (
								<Heading as='h4' px='12px' mt='8px' fontSize='12px' fontWeight='500' color='secondary'>
									Release landing pages
								</Heading>
							) : (
								<Heading as='h4' px='12px' mt='16px' fontSize='18px' fontWeight='600' color='black'>
									Your landing pages
								</Heading>
							)}
						</>
					)}

					{canAdd && (
						<CreateCard
							title='Create landing page'
							text={
								isReleasePage
									? 'Use our templates to create fully customisable landing pages'
									: 'Create a new landing page to promote your release, our landing page will allow you to link to all platforms with your release'
							}
							onClickHandler={handleCreateLandingPage}
							mt='8px'
							h={isReleasePage ? '120px' : '145px'}
						/>
					)}
					{landingPages?.length > 0 && (
						<Flex as='ul' flexDir='column' gap='8px' mt='8px'>
							{landingPages.map(el => (
								<WebPagesCard
									key={el.name}
									h={isReleasePage ? '120px' : '145px'}
									web={el}
									webType='landing'
									alt='Landing page image'
								/>
							))}
						</Flex>
					)}
					{creatorOrAdmin && selectedBap.releases?.length === 0 && !isLoading && (
						<Text
							position={'absolute'}
							top='50%'
							right='50%'
							transform={'translate(50%, -50%)'}
							color='black'
							fontSize='18px'
							fontWeight='600'
							textAlign='center'
							maxW='370px'
						>
							There are no web pages in this BAP. Add a release to get started.
						</Text>
					)}

					{!creatorOrAdmin && landingPages?.length < 1 && shops?.length < 1 && !isLoading && (
						<Text
							position={'absolute'}
							top='50%'
							right='50%'
							transform={'translate(50%, -50%)'}
							color='black'
							fontSize='18px'
							fontWeight='600'
							textAlign='center'
						>
							There are no web pages in this BAP
						</Text>
					)}
				</Box>
				{/* {isReleasePage && <NextButton onClickHandler={handleNext} mt='16px' />} */}
			</Flex>
			{isStepOneModal && (
				<СreateLandingPageModalStepOne closeModal={closeModal} openStepTwoModal={openStepTwoModal} />
			)}
			{isStepTwoModal && (
				<СreateLandingPageModalStepTwo
					closeModal={closeModal}
					openStepOneModal={openStepOneModal}
					isOnlyStreaming={isOnlyStreaming}
				/>
			)}
		</>
	);
};

export default WebPagesMenu;
