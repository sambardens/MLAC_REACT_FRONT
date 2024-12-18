import { Box, Flex, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import checkNotifications from 'src/functions/serverRequests/notifications/checkNotifications';
import resetAuth from 'src/functions/utils/resetAuth';
import { removeLinks } from 'store/links/linksSlice';
import { getUserInfo } from 'store/operations';
import { setBaps, setIsBapsWide } from 'store/slice';

import Error404 from '../Error404/Error404';
import FullPageLoader from '../Loaders/FullPageLoader';
import Meta from '../Meta/Meta';

import BapsMenu from './components/BapsMenu';
import Header from './components/Header/Header';
import NavMenu from './components/NavMenu';

const NewBapLayout = ({ children, title, description, setIsStartPage }) => {
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { isLoggedIn, jwtToken, inviteToken } = useSelector(state => state.auth);
	const { isBapsMenuWide, baps } = useSelector(state => state.user);
	const [isMenuWide, setIsMenuWide] = useState(isBapsMenuWide);
	const [isUserProfileModal, setIsUserProfileModal] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();
	const bapsMenuBtnHandler = () => {
		setIsMenuWide(!isMenuWide);
		dispatch(setIsBapsWide(!isMenuWide));
	};

	const getBapsFromServer = async () => {
		if (inviteToken) {
			const formData = new FormData();
			formData.append('isAccept', true);
			await checkNotifications(formData, inviteToken);
		}
		const res = await getBapsRequest(axiosPrivate);
		if (res) {
			dispatch(setBaps(res));
		} else {
			getToast('Error', res?.payload?.error);
			setIsError(true);
		}
		setIsLoading(false);
	};

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

	const getInfo = async () => {
		setIsLoading(true);
		const res = await dispatch(getUserInfo());
		if (res?.payload?.error) {
			getToast('Error', res?.payload?.error);
			if (res?.payload?.error === 'You must be logged in or activate the account!') {
				resetAuth(dispatch);
			} else {
				setIsError(true);
			}
		}
		if (res?.payload?.success) {
			await getBapsFromServer();
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (jwtToken && !isLoggedIn) {
			getInfo();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken, isLoggedIn]);

	useEffect(() => {
		dispatch(removeLinks());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Meta title={title} description={description} />
			{isError ? (
				<Error404 />
			) : (
				<>
					<Flex justifyContent={'space-between'} w='100vw' minH={'100vh'}>
						{isLoading || !baps ? (
							<FullPageLoader />
						) : (
							<>
								<Box width={isMenuWide ? '540px' : '412px'}>
									<Flex position={'fixed'}>
										<BapsMenu
											isMenuWide={isMenuWide}
											setIsMenuWide={setIsMenuWide}
											bapsMenuBtnHandler={bapsMenuBtnHandler}
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
									bgColor='bg.main'
									transition='width 0.3s linear'
								>
									<Header
										isUserProfileModal={isUserProfileModal}
										setIsUserProfileModal={setIsUserProfileModal}
									/>

									<Box
										minH='calc(100vh - 80px)'
										p='16px'
										bgColor='bg.secondary'
										// bgImage={'/assets/images/homepageEdited.jpg'}
										// bgSize={'100% 100%'}
										// bgPos={'center'}
									>
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

export default NewBapLayout;
