import { Box, Flex, Text, useToast } from '@chakra-ui/react';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getAdditionalReleaseInfo from 'src/functions/serverRequests/release/getAdditionalReleaseInfo';
import getTracksAuddSpotifyLinks from 'src/functions/serverRequests/track/getTracksAuddSpotifyLinks';
import getReleaseType from 'src/functions/utils/getReleaseType';
import { handleCreateRelease, saveReleaseLinks } from 'store/operations';
import { setIsAddFromSpotifyModal } from 'store/slice';

const SpotifyReleaseCard = ({ release, handleNewRelease, setIsLoading }) => {
	const toast = useToast();
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();
	const { mainGenres } = useSelector(state => state.genres);
	const spotifyLogo = release?.images?.length > 0 ? release?.images[0]?.url : '';
	const releaseSpotifyId = release?.id;
	const { releases, bapId } = useSelector(state => state.user.selectedBap);
	const isExisting = releases.find(el => el.releaseSpotifyId === releaseSpotifyId);

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

	const handleCreateSpotifyRelease = async () => {
		const type = getReleaseType(release.album_type);
		setIsLoading(true);
		const newSpotifyRes = await getAdditionalReleaseInfo(releaseSpotifyId, mainGenres);
		if (!newSpotifyRes?.success) {
			getToast('error', 'Error', 'Something went wrong. Can not get information about current release. Try again later');
			setIsLoading(false);
			return;
		}
		const { spotifyData } = newSpotifyRes;

		const data = {
			bapId,
			formData: {
				name: release.name,
				urlLogo: spotifyData?.appleMusicLogo || spotifyLogo,
				type,
				releaseDate: release?.release_date,
				releaseSpotifyId,
				spotifyUri: spotifyData?.spotifyUri,
				label: spotifyData?.label,
				upc: spotifyData.upc,
				totalTracks: spotifyData?.totalTracks,
				copyrights: spotifyData?.copyrights,
			},
			isExisting: true,
		};
		if (spotifyData.genres) {
			data.formData = { ...data.formData, ...spotifyData.genres.genresRequestBody };
			data.genresData = spotifyData.genres.genresData;
		}

		const res = await dispatch(handleCreateRelease(data));

		if (res?.payload?.success) {
			const allTracksStreamingLinks = await getTracksAuddSpotifyLinks(releaseSpotifyId, axiosPrivate);
			dispatch(
				saveReleaseLinks({
					releaseSpotifyId,
					allTracksStreamingLinks,
				}),
			);
			handleNewRelease();
			dispatch(setIsAddFromSpotifyModal(false));
		} else {
			getToast('error', 'Error', res?.payload?.error);
		}
		setIsLoading(false);
	};
	return (
		<Flex
			as='li'
			w='200px'
			h='200px'
			borderRadius='10px'
			bg='accent'
			pos='relative'
			bgImage={`url(${spotifyLogo})`}
			bgSize='100% 100%'
			bgPosition='center'
			onClick={() => {
				!isExisting && handleCreateSpotifyRelease();
			}}
			borderColor='transparent'
			_hover={{ boxShadow: !isExisting && '0px 2px 4px 2px rgba(0, 0, 0, 0.2)' }}
			cursor={isExisting ? 'initial' : 'pointer'}
			overflow='hidden'
			flexDir='column'
			justify='flex-end'
		>
			<Box bgColor='gray' p='12px' w='100%' align='center'>
				<Text wordBreak='break-word' fontWeight='500' fontSize='16px' color='white' isTruncated={true} align='center'>
					{release?.name}
				</Text>
				<Text fontWeight='400' fontSize='14px' color='white' align='center'>
					{release?.release_date}
				</Text>
			</Box>
			{isExisting && (
				<Text position={'absolute'} top='12px' right='16px' px='8px' py='4px' bg={'accent'} fontWeight={'400'} fontSize={'14px'} color='white' borderRadius={'31px'} pointerEvents='none'>
					On Major Labl
				</Text>
			)}
		</Flex>
	);
};

export default SpotifyReleaseCard;
