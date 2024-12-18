import { Box, useToast } from '@chakra-ui/react';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDealsByBapId, getLandingPagesByBapId, getShopsByBapId } from 'store/operations';
import { resetSelectedRelease, setDefaultReleaseModalMenuScreen } from 'store/slice';

import CreateContractOrSplit from '@/components/CreateContractOrSplit/CreateContractOrSplit';

import FullPageLoader from '../Loaders/FullPageLoader';

import ContractsAndSplitsList from './ContractsAndSplitsList/ContractsAndSplitsList';

const Contracts = () => {
	const { selectedBap } = useSelector(state => state.user);
	const user = useSelector(state => state.user.user);
	const [isStartPage, setIsStartPage] = useState(true);
	const [withContract, setWithContract] = useState(true);
	const [isLoader, setIsLoader] = useState(true);
	const [deals, setDeals] = useState([]);

	const dispatch = useDispatch();
	const toast = useToast();
	const getToast = (status, title, description) => {
		toast({
			position: 'top',
			title,
			description,
			status,
			duration: 5000,
			isClosable: true,
		});
	};
	const setContractsAndSplitsFromServer = async () => {
		setIsLoader(true);
		const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;

		const promises = [
			dispatch(getLandingPagesByBapId(selectedBap?.bapId)),
			dispatch(getShopsByBapId(selectedBap?.bapId)),
			dispatch(
				getDealsByBapId({
					bapId: selectedBap?.bapId,
					userId: user?.id,
					creatorOrAdmin,
				}),
			),
		];

		const results = await Promise.all(promises);
		const success = results.every(result => result?.payload?.success);

		if (!results[2]?.payload?.success) {
			getToast('error', 'Error', 'Failed to load all your contracts and splits');
		} else if (!success) {
			getToast('error', 'Error', 'Something went wrong. Please refresh page.');
		}

		setIsLoader(false);
	};

	useEffect(() => {
		if (selectedBap?.bapId && selectedBap?.bapMembers) {
			setContractsAndSplitsFromServer();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.bapId, selectedBap?.bapMembers]);

	useEffect(() => {
		dispatch(resetSelectedRelease());
		dispatch(setDefaultReleaseModalMenuScreen());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedBap?.splitsAndContracts?.length > 0) {
			setDeals(selectedBap?.splitsAndContracts);
		} else {
			setDeals([]);
		}
	}, [selectedBap?.splitsAndContracts]);

	useEffect(() => {
		if (selectedBap?.bapId) {
		}
	}, [dispatch, selectedBap?.bapId]);

	return (
		<Box position={'relative'} h='100%'>
			{isLoader && <FullPageLoader position={'absolute'} />}
			{!isLoader && (
				<>
					{isStartPage ? (
						<ContractsAndSplitsList
							deals={deals}
							setWithContract={setWithContract}
							setIsStartPage={setIsStartPage}
						/>
					) : (
						<CreateContractOrSplit
							withContract={withContract}
							setWithContract={setWithContract}
							setIsStartPage={setIsStartPage}
						/>
					)}
				</>
			)}
		</Box>
	);
};
export default Contracts;
