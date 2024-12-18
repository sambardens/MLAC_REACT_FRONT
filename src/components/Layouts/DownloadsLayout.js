import { Box, Flex } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getUserInfo } from 'store/operations';

import Error404 from '../Error404/Error404';
import FullPageLoader from '../Loaders/FullPageLoader';
import Meta from '../Meta/Meta';

import Header from './components/Header/Header';

const DownloadsLayout = ({ children, title, description }) => {
	const [isUserProfileModal, setIsUserProfileModal] = useState(false);
	const dispatch = useDispatch();
	const { isLoggedIn, jwtToken } = useSelector(state => state.auth);
	const { isLoading, isError } = useSelector(state => state.user);

	useEffect(() => {
		if (jwtToken && !isLoggedIn) {
			dispatch(getUserInfo());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken, isLoggedIn]);
	return (
		<>
			{isError ? (
				<Error404 />
			) : (
				<>
					<Meta title={title} description={description} />
					<Flex justify='space-between' w='100vw' minH='100vh'>
						{isLoading ? (
							<FullPageLoader />
						) : (
							<Flex flexDir='column' w='100%' bgColor='bg.main' transition='width 0.3s linear'>
								<Header
									isDownloadPage={true}
									setIsUserProfileModal={setIsUserProfileModal}
									isUserProfileModal={isUserProfileModal}
								/>
								<Box bgColor='bg.secondary' minH='100vh'>
									{children}
								</Box>
							</Flex>
						)}
					</Flex>
				</>
			)}
		</>
	);
};

export default DownloadsLayout;
