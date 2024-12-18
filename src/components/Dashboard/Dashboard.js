import { useRouter } from 'next/router';

import { Flex } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { resetAudio } from 'store/audio/audio-slice';
import { getLandingPagesByBapId, getShopsByBapId } from 'store/operations';
import {
	resetSelectedRelease,
	setDefaultReleaseModalMenuScreen,
	setIsAddNewReleaseModal,
} from 'store/slice';

import { Releases } from '../Downloads/components/Releases';

import MembersBoard from './components/MembersBoard';
import PagesBoard from './components/PagesBoard';

const Dashboard = () => {
	const { push } = useRouter();
	const dispatch = useDispatch();
	const { selectedBap } = useSelector(state => state.user);
	const [isLoading, setIsLoading] = useState(true);

	const addReleaseHandler = () => {
		dispatch(setIsAddNewReleaseModal(true));
		push({
			pathname: '/bap/[bapId]/releases',
			query: { bapId: selectedBap.bapId },
		});
	};
	const handleOpenRelease = releaseId => {
		push({
			pathname: '/bap/[bapId]/releases/[releaseId]',
			query: { bapId: selectedBap.bapId, releaseId },
		});
	};

	useEffect(() => {
		dispatch(resetSelectedRelease());
		dispatch(setDefaultReleaseModalMenuScreen());
	}, [dispatch]);

	useEffect(() => {
		const getWebpages = async () => {
			setIsLoading(true);
			const shopRequest = dispatch(getShopsByBapId(selectedBap?.bapId));
			const landingPageRequest = dispatch(getLandingPagesByBapId(selectedBap?.bapId));
			await Promise.all([shopRequest, landingPageRequest]);
			setIsLoading(false);
		};
		if (selectedBap?.bapId) {
			getWebpages();
			dispatch(resetAudio());
		}
	}, [dispatch, selectedBap?.bapId]);

	return (
		<Flex flexDir='column' h='100%'>
			<Releases
				jc='start'
				handleOpenRelease={handleOpenRelease}
				addReleaseHandler={addReleaseHandler}
				isLoading={isLoading}
			/>

			<Flex mt='16px' gap='16px' h='100%'>
				<MembersBoard isLoading={isLoading} />
				<PagesBoard isLoading={isLoading} />
			</Flex>
		</Flex>
	);
};

export default Dashboard;
