import { Flex, Heading, Icon, Text, useToast } from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { MutatingDots } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import getReleasesByUserSpotifyId from 'src/functions/serverRequests/spotify/getReleasesByUserSpotifyId';
import { setIsAddFromSpotifyModal } from 'store/slice';
import { transliterate as tr } from 'transliteration';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomModal from '@/components/Modals/CustomModal';

import SearchIcon from '@/assets/icons/base/search.svg';
import SpotifyIcon from '@/assets/icons/social/spotify.svg';

import SpotifyReleaseCard from '../SpotifyReleaseCard/SpotifyReleaseCard';

const AddReleaseFromSpotifyModal = ({ handleNewRelease }) => {
	const axiosPrivate = useAxiosPrivate();
	const { selectedBap } = useSelector(state => state.user);
	const [isLoading, setIsLoading] = useState(false);
	const [releases, setReleases] = useState([]);
	const toast = useToast();
	const [searchValue, setSearchValue] = useState('');
	const dispatch = useDispatch();

	const handleChange = async e => {
		const { value } = e.target;
		const valueLatinica = tr(value);
		setSearchValue(valueLatinica);
	};

	const handleGetSpotifyReleases = async id => {
		setIsLoading(true);
		const res = await getReleasesByUserSpotifyId(id, axiosPrivate);

		if (res?.success) {
			setReleases(res.artistAlbum);
		} else {
			toast({
				position: 'top',
				title: 'Error',
				description: 'Can not get releases from Spotify. Try again later',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
		setIsLoading(false);
	};

	useEffect(() => {
		if (selectedBap?.spotifyId) {
			handleGetSpotifyReleases(selectedBap?.spotifyId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBap?.spotifyId]);

	const normalizedFilterValue = searchValue?.toLowerCase().trim();
	const filteredReleases =
		releases.length > 0 && normalizedFilterValue
			? releases?.filter(release => release.name.toLowerCase().includes(normalizedFilterValue))
			: releases;
	return (
		<CustomModal
			closeModal={() => {
				dispatch(setIsAddFromSpotifyModal(false));
			}}
			w='80vw'
			maxW='928px'
			h='650px'
			p='40px 0'
		>
			<Flex pr='14px' align='center' px='40px'>
				<Heading fontSize='32px' fontWeight='600'>
					Add release from Spotify
				</Heading>
				<Icon as={SpotifyIcon} ml='16px' boxSize='32px' />
			</Flex>

			<Flex justifyContent='space-between' mt='16px' px='40px'>
				<CustomInput
					icon={SearchIcon}
					maxW='404px'
					placeholder='Search'
					value={searchValue}
					onChange={handleChange}
					name='searchValue'
				/>
			</Flex>
			{isLoading ? (
				<Flex alignItems={'center'} justifyContent={'center'} h='416px'>
					<MutatingDots
						height={'100'}
						width={'100'}
						color={'#db2754'}
						secondaryColor={'#db2754'}
						radius='12.5'
						ariaLabel='mutating-dots-loading'
						wrapperStyle={{}}
						wrapperClass=''
						visible={true}
					/>
				</Flex>
			) : (
				<>
					{releases?.length > 0 ? (
						<>
							{filteredReleases.length > 0 ? (
								<Flex
									as='ul'
									align='space-between'
									gap='16px'
									w='100%'
									flexWrap='wrap'
									h='416px'
									overflowY='scroll'
									pl='40px'
									pr='33px'
									mt='24px'
								>
									{filteredReleases?.map(release => (
										<SpotifyReleaseCard
											key={nanoid()}
											release={release}
											handleNewRelease={handleNewRelease}
											setIsLoading={setIsLoading}
										/>
									))}
								</Flex>
							) : (
								<Flex justify='center' align='center' h='416px' pr='14px'>
									<Text mt='20px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
										Can not find release
									</Text>
								</Flex>
							)}
						</>
					) : (
						<Flex justify='center' align='center' h='416px' pr='14px'>
							<Text mt='20px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
								There are no releases at Spotify
							</Text>
						</Flex>
					)}
				</>
			)}
		</CustomModal>
	);
};

export default AddReleaseFromSpotifyModal;
