import { useRouter } from 'next/router';

import { useToast } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getBapsRequest from 'src/functions/serverRequests/bap/getBapsRequest';
import resetAuth from 'src/functions/utils/resetAuth';
import {
	getBapMembers,
	getBapReleases,
	getOneLandingPage,
	getTracksToReleaseWithArtistLogo,
	getUserInfo,
} from 'store/operations';
import { setBap, setBaps, setLandingPage, setSelectedRelease } from 'store/slice';

import Error404 from '../Error404/Error404';
import FullPageLoader from '../Loaders/FullPageLoader';

const WebPagesConstructorLayout = ({ children, webpagesTypeId }) => {
	const [isStateError, setIsStateError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const axiosPrivate = useAxiosPrivate();
	const { query, push } = useRouter();
	const { isLoggedIn, jwtToken } = useSelector(state => state.auth);
	const { baps, selectedBap, user, selectedRelease } = useSelector(state => state.user);
	const dispatch = useDispatch();

	const toast = useToast();
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
	const releaseIdFromQuery = query?.releaseId && Number(query.releaseId);
	const bapIdFromQuery = query?.bapId && Number(query.bapId);
	const landingIdFromQuery = query?.landingId;
	const getBapsFromServer = async () => {
		setIsLoading(true);
		const bapsWithLogo = await getBapsRequest(axiosPrivate);
		if (bapsWithLogo) {
			dispatch(setBaps(bapsWithLogo));
		} else {
			setIsStateError(true);
		}
	};

	const getNewSelectedBap = async () => {
		setIsLoading(true);
		const currentBap = baps.find(bap => bap?.bapId === bapIdFromQuery);
		if (currentBap) {
			dispatch(setBap(currentBap));
			dispatch(getBapReleases(currentBap.bapId));
			dispatch(getBapMembers({ bapId: currentBap.bapId, userId: user?.id }));
		} else {
			getToast('Error', 'Current B.A.P. is not available');
			push('/my-splits-contracts');
		}
		!releaseIdFromQuery && setIsLoading(false);
	};

	const getNewSelectedRelease = async () => {
		if (selectedBap?.releases?.length > 0) {
			const currentRelease = selectedBap?.releases?.find(el => el.id === releaseIdFromQuery);
			if (currentRelease) {
				dispatch(setSelectedRelease({ ...currentRelease }));
				await dispatch(getTracksToReleaseWithArtistLogo(currentRelease.id));
			} else {
				setIsStateError(true);
			}
			setIsLoading(false);
		} else {
			setIsStateError(true);
		}
	};
	const getInfo = async () => {
		setIsLoading(true);
		const res = await dispatch(getUserInfo());
		if (res?.payload?.error) {
			getToast('Error', res?.payload?.error);
			if (res?.payload?.error === 'You must be logged in or activate the account!') {
				resetAuth(dispatch);
			} else {
				setIsStateError(true);
			}
		}
	};
	const areBaps = Boolean(baps);
	const areTracks = Boolean(selectedRelease?.checkedTracks);
	const areReleases = Boolean(selectedBap?.releases);
	const isNewSelectedBap =
		jwtToken && isLoggedIn && areBaps && bapIdFromQuery !== selectedBap?.bapId;
	const isNewSelectedRelease =
		bapIdFromQuery === selectedBap?.bapId &&
		releaseIdFromQuery &&
		releaseIdFromQuery !== selectedRelease?.id;

	useEffect(() => {
		if (bapIdFromQuery) {
			if (jwtToken && !isLoggedIn) {
				getInfo();
			} else if (jwtToken && isLoggedIn && !baps) {
				getBapsFromServer();
			} else if (isNewSelectedBap) {
				getNewSelectedBap();
			} else if (isNewSelectedRelease) {
				getNewSelectedRelease();
			} else if (landingIdFromQuery && selectedRelease?.checkedTracks) {
				dispatch(getOneLandingPage(landingIdFromQuery));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwtToken, isLoggedIn, bapIdFromQuery, areBaps, areTracks, areReleases, landingIdFromQuery]);

	useEffect(() => {
		if (webpagesTypeId) {
			dispatch(setLandingPage({ webpagesTypeId }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [webpagesTypeId]);
	const pageLoader = !bapIdFromQuery || isLoading || !selectedBap?.bapId || !baps;

	const path = `/bap/${bapIdFromQuery}/web-pages`;
	return (
		<>{isStateError ? <Error404 path={path} /> : <>{pageLoader ? <FullPageLoader /> : children}</>}</>
	);
};

export default WebPagesConstructorLayout;
