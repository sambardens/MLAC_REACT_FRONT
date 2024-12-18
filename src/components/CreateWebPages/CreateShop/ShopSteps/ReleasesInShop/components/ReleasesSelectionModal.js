import { Flex, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import prepareReleasesWithActualTracks from 'src/functions/serverRequests/shop/releases/prepareReleasesWithActualTracks';
import { setShop } from 'store/shop/shop-slice';

import CustomButton from '@/components/Buttons/CustomButton';
import FullPageLoader from '@/components/Loaders/FullPageLoader';
import CustomModal from '@/components/Modals/CustomModal';

import ReleaseSelectionCard from './ReleaseSelectionCard';

const ReleasesSelectionModal = ({ closeModal }) => {
	const dispatch = useDispatch();
	const shop = useSelector(state => state.shop);
	const { selectedBap } = useSelector(state => state.user);

	const bapReleases = useSelector(state => state?.user?.selectedBap?.releases) || [];
	const axiosPrivate = useAxiosPrivate();
	const bapReleasesForShop = useSelector(state => state.shop.bapReleases);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedReleases, setSelectedReleases] = useState(shop.selectedShopReleases || []);

	const saveSelectedReleasesInRedux = () => {
		const updatedShop = { ...shop, selectedShopReleases: selectedReleases };
		dispatch(setShop(updatedShop));
		closeModal();
	};

	const cancelHandler = () => {
		setSelectedReleases(shop.selectedShopReleases);
		closeModal();
	};

	const handlePrepareReleases = async () => {
		setIsLoading(true);
		const tracksInDeals = selectedBap?.splitsAndContracts
			?.filter(el => el.status === 1)
			?.map(el => el.splitTracks)
			?.flat();
		const preparedBapReleases = await prepareReleasesWithActualTracks(
			bapReleases,
			axiosPrivate,
			tracksInDeals,
		);

		const shopWithBapReleases = { ...shop, bapReleases: preparedBapReleases };
		dispatch(setShop(shopWithBapReleases));
		setIsLoading(false);
	};

	useEffect(() => {
		handlePrepareReleases();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CustomModal
			closeModal={closeModal}
			maxW='928px'
			maxH='90vh'
			w='80vw'
			minH='420px'
			p='40px 26px 40px 40px'
		>
			{isLoading && <FullPageLoader position={'absolute'} />}

			{!isLoading && bapReleasesForShop?.length < 1 && (
				<Flex
					position={'absolute'}
					top='50%'
					right='50%'
					transform={'translate(50%, -50%)'}
					justify='center'
					align='center'
					h='200px'
					pr='14px'
				>
					<Text mt='24px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
						You don&apos;t have any releases in this B.A.P.
					</Text>
				</Flex>
			)}

			{!isLoading && bapReleasesForShop?.length > 0 && (
				<Flex flexDir={'column'}>
					<Text textAlign={'center'} fontWeight={'600'} fontSize={'24px'}>
						Please select the releases you would like to sell in your shop
					</Text>
					<Flex
						as='ul'
						alignItems='space-between'
						gap='16px'
						w='100%'
						flexWrap='wrap'
						h='fit-content'
						maxH='416px'
						overflowY='scroll'
						pr='8px'
						mt='24px'
					>
						{bapReleasesForShop?.map(release => (
							<ReleaseSelectionCard
								setSelectedReleases={setSelectedReleases}
								selectedReleases={selectedReleases}
								key={release.id}
								release={release}
								w='200px'
								h='200px'
								page='contract'
							/>
						))}
					</Flex>
					<Flex alignSelf={'end'} mt='24px'>
						<CustomButton onClickHandler={cancelHandler} styles='transparent'>
							Cancel
						</CustomButton>
						<CustomButton onClickHandler={saveSelectedReleasesInRedux} ml='16px'>
							Save
						</CustomButton>
					</Flex>
				</Flex>
			)}
		</CustomModal>
	);
};

export default ReleasesSelectionModal;
