import { Box, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyDeals } from 'store/operations';
import {
	resetSelectedBap,
	resetSelectedBapUpdated,
	resetSelectedRelease,
	setDefaultReleaseModalMenuScreen,
} from 'store/slice';

import ContractsAndSplitsList from '../Contracts/ContractsAndSplitsList/ContractsAndSplitsList';
import CreateContractOrSplit from '../CreateContractOrSplit/CreateContractOrSplit';
import FullPageLoader from '../Loaders/FullPageLoader';

const MyContractsAndSplits = () => {
	const { user, allSplitsAndContracts } = useSelector(state => state.user);
	const [isStartPage, setIsStartPage] = useState(true);
	const [withContract, setWithContract] = useState(true);
	const [isLoader, setIsLoader] = useState(false);
	const [deals, setDeals] = useState([]);

	const dispatch = useDispatch();
	const toast = useToast();

	useEffect(() => {
		const getContractsAndSplitsFromServer = async userId => {
			setIsLoader(true);
			const resData = await dispatch(getMyDeals(userId));

			if (!resData?.payload?.success) {
				toast({
					position: 'top',
					title: 'Error',
					description: `Failed to load your contracts and splits: ${resData?.payload.error}`,
					status: 'error',
					duration: 4000,
					isClosable: true,
				});
			}
			setIsLoader(false);
		};
		if (user?.id) {
			getContractsAndSplitsFromServer(user?.id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user?.id]);

	useEffect(() => {
		dispatch(resetSelectedRelease());
		dispatch(resetSelectedBap());
		dispatch(resetSelectedBapUpdated());
		dispatch(setDefaultReleaseModalMenuScreen());
	}, [dispatch]);

	useEffect(() => {
		if (allSplitsAndContracts?.length > 0) {
			setDeals(allSplitsAndContracts);
		} else {
			setDeals([]);
		}
	}, [allSplitsAndContracts]);

	return (
		<>
			<Box position={'relative'} h='100%'>
				{isLoader && <FullPageLoader position={'absolute'} />}
				{!isLoader && (
					<>
						{isStartPage ? (
							<ContractsAndSplitsList
								setWithContract={setWithContract}
								setIsStartPage={setIsStartPage}
								deals={deals}
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
		</>
	);
};

export default MyContractsAndSplits;
