import { useRouter } from 'next/router';

import { Box, Flex, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import checkNotifications from 'src/functions/serverRequests/notifications/checkNotifications';
import resetAuth from 'src/functions/utils/resetAuth';
import { getGenres } from 'store/genres/genres-operations';
import { getBapSocialLinks } from 'store/links/links-operations';
import { getBapGenres, getBapMembers, getBapReleases, getUserInfo } from 'store/operations';
import { setBap, setBaps, setIsBapsWide } from 'store/slice';

import Error404 from '../Error404/Error404';
import FullPageLoader from '../Loaders/FullPageLoader';
import Meta from '../Meta/Meta';

import BapsMenu from './components/BapsMenu';
import Header from './components/Header/Header';
import NavMenu from './components/NavMenu';

const MainLayout = ({ children, title, description, setIsStartPage }) => {
	const [isStateError, setIsStateError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { query, pathname, push } = useRouter();
	const { isLoggedIn, jwtToken } = useSelector(state => state.auth);
	const { mainGenres } = useSelector(state => state.genres);
	const { isBapsMenuWide, baps, selectedBap, user } = useSelector(state => state.user);
	const { inviteToken } = useSelector(state => state.auth);
	const [isMenuWide, setIsMenuWide] = useState(isBapsMenuWide);
	const [isUserProfileModal, setIsUserProfileModal] = useState(false);
	const toast = useToast();
	const dispatch = useDispatch();
	const bapIdFromQuery = query?.bapId && Number(query.bapId);
	const isWelcomePage = pathname.includes('/welcome');

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 5000,
			isClosable: true,
		});
	};

	const bapsMenuBtnHandler = () => {
		setIsMenuWide(!isMenuWide);
		dispatch(setIsBapsWide(!isMenuWide));
	};

	const getBapsFromServer = async () => {
		setIsLoading(true);
		if (inviteToken) {
			const formData = new FormData();
			formData.append('isAccept', true);
			await checkNotifications(formData, inviteToken);
		}
		const res = await getBapsRequest(axiosPrivate);
		if (res) {
			dispatch(setBaps(res));
		} else {
			setIsStateError(true);
		}
		setIsLoading(false);
	};

	const getNewSelectedBap = async () => {
		const currentBap = baps.find(bap => bap.bapId === bapIdFromQuery);

		if (currentBap) {
			dispatch(setBap(currentBap));
			dispatch(getBapReleases(currentBap.bapId));
			dispatch(getBapMembers({ bapId: currentBap.bapId, userId: user?.id }));
			dispatch(getBapGenres(currentBap.bapId));
			dispatch(getBapSocialLinks(currentBap.bapId));
		} else {
			getToast(
				'Error',
				'The current B.A.P. is not available. Redirect to my splits and contracts page.',
			);
			push('/my-splits-contracts');
		}
	};

	const getInfo = async () => {
		setIsLoading(true);
		const res = await dispatch(getUserInfo());
		if (res?.payload?.error) {
			if (res?.payload?.error === 'You must be logged in or activate the account!') {
				resetAuth(dispatch);
			} else {
				console.log('getUserInfo ошибка', res);
				setIsStateError(true);
			}
		}
		baps && setIsLoading(false);
	};
	const areBaps = !!baps;

	useEffect(() => {
		if (jwtToken && !isLoggedIn) {
			getInfo();
		} else if (jwtToken && isLoggedIn && !baps) {
			getBapsFromServer();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken, isLoggedIn, areBaps]);

	useEffect(() => {
		if (
			jwtToken &&
			isLoggedIn &&
			user?.id &&
			baps &&
			bapIdFromQuery &&
			bapIdFromQuery !== selectedBap?.bapId
		) {
			getNewSelectedBap(baps, user);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken, isLoggedIn, areBaps, bapIdFromQuery, user?.id]);

	useEffect(() => {
		if (jwtToken && isLoggedIn && !mainGenres) {
			dispatch(getGenres());
		}
	}, [jwtToken, isLoggedIn, mainGenres, dispatch]);

	const pageLoading = isLoading || !baps;

	return (
		<>
			<Meta title={title} description={description} />
			{isStateError ? (
				<Error404 />
			) : (
				<>
					<Flex justifyContent={'space-between'} w='100vw' minH={'100vh'}>
						{pageLoading ? (
							<FullPageLoader />
						) : (
							<>
								<Box width={isMenuWide ? '540px' : '412px'}>
									<Flex position={'fixed'}>
										<BapsMenu
											isMenuWide={isMenuWide}
											setIsMenuWide={setIsMenuWide}
											bapsMenuBtnHandler={bapsMenuBtnHandler}
											setIsStartPage={setIsStartPage}
										/>
										<NavMenu
											setIsStartPage={setIsStartPage}
											setIsUserProfileModal={setIsUserProfileModal}
											isUserProfileModal={isUserProfileModal}
										/>
									</Flex>
								</Box>

								<Flex
									flexDir={'column'}
									w={`calc(100vw - ${isMenuWide ? '540px' : '412px'})`}
									bgColor='bg.secon'
									transition='width 0.3s linear'
								>
									<Header
										isUserProfileModal={isUserProfileModal}
										setIsUserProfileModal={setIsUserProfileModal}
									/>

									<Box minH='calc(100vh - 80px)' p={isWelcomePage ? 0 : '16px'} bgColor='bg.secondary'>
										{children}
									</Box>
								</Flex>
							</>
						)}
					</Flex>
				</>
			)}
		</>
	);
};

export default MainLayout;
