import { useRouter } from 'next/router';

import { Box, Flex, Text, Tooltip, useToast } from '@chakra-ui/react';

import { useDispatch, useSelector } from 'react-redux';
import { getTracksToReleaseWithArtistLogo } from 'store/operations';
import {
	setReleaseScreen,
	setReleaseSelectedMenu,
	setSelectedRelease,
	setSplitTypeModalStatus,
} from 'store/slice';

const ReleaseCard = ({ release, w = '232px', h = '212px', openStepTwoModal, setIsLoading }) => {
	const { selectedRelease, selectedBap } = useSelector(state => state.user);
	const { push, pathname } = useRouter();
	const dispatch = useDispatch();
	const toast = useToast();
	const dashboardOrWebPage = pathname.includes('/web-pages') || pathname.includes('/dashboard');

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

	const onCard = async () => {
		if (dashboardOrWebPage) {
			if (release.isDuplicate) {
				return;
			}
			if (selectedRelease?.id === release.id && selectedRelease?.checkedTracks?.length > 0) {
				openStepTwoModal();
				return;
			}
			setIsLoading(true);
			dispatch(setSelectedRelease({ ...release }));
			const res = await dispatch(getTracksToReleaseWithArtistLogo(release.id));
			if (
				(!release.releaseSpotifyId && res?.payload?.tracks?.length > 0) ||
				release.releaseSpotifyId
			) {
				openStepTwoModal();
			} else {
				getToast(
					'Error',
					'There are no tracks in this release.You need to add tracks if you want to create a landing page',
				);
			}
			setIsLoading(false);
		} else if (pathname.endsWith('/splits-contracts')) {
			dispatch(setReleaseSelectedMenu(3));
			dispatch(setSplitTypeModalStatus(true));
			dispatch(setReleaseScreen('main'));

			push({
				pathname: '/bap/[bapId]/releases/[releaseId]',
				query: { bapId: selectedBap?.bapId, releaseId: release.id },
			});
		} else {
			dispatch(setReleaseSelectedMenu(1));
			dispatch(setSplitTypeModalStatus(false));
			dispatch(setReleaseScreen('review'));
			push({
				pathname: '/bap/[bapId]/releases/[releaseId]',
				query: { bapId: selectedBap?.bapId, releaseId: release.id },
			});
		}
	};

	const date = new Date(release?.releaseDate);
	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
	const year = date.getUTCFullYear().toString();
	const formattedDate = `${day}-${month}-${year}`;

	return (
		<Flex
			as='li'
			w={w}
			h={h}
			borderRadius='10px'
			bg='accent'
			pos='relative'
			bgImage={release?.logo ? `url(${release?.logoMin || release.logo})` : 'none'}
			bgSize='100% 100%'
			bgPosition='center'
			onClick={onCard}
			borderColor='transparent'
			overflow='hidden'
			alignItems='flex-end'
			_hover={
				dashboardOrWebPage && release.isDuplicate
					? null
					: { boxShadow: '0px 2px 4px 2px rgba(0, 0, 0, 0.2)' }
			}
			cursor={dashboardOrWebPage && release.isDuplicate ? 'initial' : 'pointer'}
			filter={dashboardOrWebPage && release.isDuplicate ? 'brightness(0.5)' : null}
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
					{formattedDate}
				</Text>
			</Box>
			{release.isDuplicate && (
				<Text
					position={'absolute'}
					top='12px'
					right='16px'
					px='8px'
					py='4px'
					bg={'accent'}
					fontWeight={'400'}
					fontSize={'14px'}
					color='white'
					borderRadius={'31px'}
					pointerEvents='none'
				>
					duplicate
				</Text>
			)}
		</Flex>
	);
};

export default ReleaseCard;
