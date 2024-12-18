import { Box, Flex, Text, Tooltip, useToast } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import getFormattedDate from 'src/functions/utils/getFormattedDate';

const ReleaseSelectionCard = ({ setSelectedReleases, selectedReleases, release, w, h }) => {
	const toast = useToast();
	const selectedShopReleases = useSelector(state => state.shop.selectedShopReleases) || [];
	const { selectedBap } = useSelector(state => state.user);

	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'info',
			duration: 5000,
			isClosable: true,
		});
	};

	const checkTracks = () => {
		const tracksInDeals = selectedBap?.splitsAndContracts
			.filter(el => el.releaseId === release.id && el.status === 1)
			.map(el => el.splitTracks)
			.flat();
		let description;
		if (tracksInDeals?.length > 0) {
			const releaseTracks = [];
			tracksInDeals.forEach(el => {
				const trackToLanding = release?.tracks.find(releaseTrack => releaseTrack.id === el.trackId);
				if (trackToLanding) {
					releaseTracks.push(trackToLanding);
				}
			});
			// dispatch(setLandingTracks(landingTracks));
			const difference = release?.tracks?.length - tracksInDeals.length;

			if (difference) {
				description =
					difference > 1
						? 'Some of tracks in the release are without split or active contract. Those tracks are not available to sell in landing page'
						: 'One track in the release is without split or active contract. This track is not available to sell in landing page';
				return { status: 'Attention', description };
			} else {
				return { status: 'success' };
			}
		} else {
			description =
				'There are no tracks available to sell in current release. Some track must have split or active contract!';
			return {
				status: 'Error',
				description,
			};
		}
	};
	const isChosen = selectedReleases.find(rel => rel.id === release.id);
	const tracksRes = checkTracks();
	const handleAddReleaseToShop = async () => {
		if (release?.isDuplicate) {
			return;
		}
		if (!selectedBap?.splitsAndContracts && selectedBap?.splitsAndContracts?.length === 0) {
			getToast(
				'Error',
				'There are no splits or contracts for the selected release. Tracks must have a split or active contract if you want to sell them.',
			);
			return;
		}

		if (!release.isCanBeSold.status) {
			getToast('Error', release.isCanBeSold.reason);
			return;
		}

		if (tracksRes.status === 'Error') {
			getToast(tracksRes.status, tracksRes.description);
			return;
		}

		if (!isChosen) {
			if (tracksRes.status === 'Attention') {
				getToast(tracksRes.status, tracksRes.description);
			}

			const selectedRelease = { ...release, backgroundBlur: 50 };
			const updatedReleases = [...selectedShopReleases];
			updatedReleases.push(selectedRelease);
			setSelectedReleases(updatedReleases);
		}

		if (isChosen) {
			const updatedReleases = [...selectedShopReleases].filter(rel => rel.id !== release.id);
			setSelectedReleases(updatedReleases);
		}
	};

	const mainStyle = tracksRes.status !== 'Error' && release.isCanBeSold.status;

	return (
		<Flex
			as='li'
			w={w}
			h={h}
			borderRadius='10px'
			bg='accent'
			pos='relative'
			bgImage={`url(${release.logo})`}
			bgSize='100% 100%'
			bgPosition='center'
			onClick={handleAddReleaseToShop}
			borderColor='transparent'
			overflow='hidden'
			alignItems='flex-end'
			_hover={mainStyle ? { boxShadow: '0px 2px 4px 2px rgba(0, 0, 0, 0.2)' } : null}
			cursor={mainStyle ? 'pointer' : 'initial'}
			filter={mainStyle ? null : 'brightness(0.5)'}
		>
			<Box bgColor='gray' p='12px' w='100%'>
				<Tooltip
					isDisabled={release.name.length < 24}
					label={release.name}
					hasArrow
					bg='secondary'
					borderRadius='10px'
					fontWeight='500'
					fontSize='14px'
				>
					<Text fontWeight='500' fontSize='16px' color='white' mb='8px' isTruncated={true}>
						{release.name}
					</Text>
				</Tooltip>
				<Text fontWeight='400' fontSize='14px' color='white'>
					{getFormattedDate(release.createdAt)}
				</Text>
			</Box>
			{release?.isDuplicate && (
				<Text
					position={'absolute'}
					top='12px'
					right='16px'
					px='8px'
					py='4px'
					bg='#FF0151'
					fontWeight={'400'}
					fontSize={'14px'}
					color='white'
					borderRadius={'31px'}
				>
					duplicate
				</Text>
			)}
			{!release?.isDuplicate && isChosen && (
				<Text
					position={'absolute'}
					top='12px'
					right='16px'
					px='8px'
					py='4px'
					bg='#FF0151'
					fontWeight={'400'}
					fontSize={'14px'}
					color='white'
					borderRadius={'31px'}
				>
					Chosen
				</Text>
			)}
		</Flex>
	);
};

export default ReleaseSelectionCard;
