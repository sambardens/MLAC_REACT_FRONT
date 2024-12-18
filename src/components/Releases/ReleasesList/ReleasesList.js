import { Flex, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetSelectedRelease, setIsAddNewReleaseModal } from 'store/slice';

import PlusButton from '@/components/Buttons/PlusButton/PlusButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import { BandSearchInSpotify } from '@/components/Spotify/BandSearchInSpotify';

import SearchIcon from '@/assets/icons/base/search.svg';

import ReleaseCard from '../ReleaseCard/ReleaseCard';
import AddReleaseFromSpotifyModal from '../ReleaseModals/AddReleaseFromSpotifyModal';
import AddReleaseModal from '../ReleaseModals/AddReleaseModal';
import ChooseExistingReleaseModal from '../ReleaseModals/ChooseExistingReleaseModal';

const ReleasesList = ({ handleNewRelease }) => {
	const dispatch = useDispatch();
	const { selectedBap } = useSelector(state => state.user);
	const releases = useSelector(state => state.user.selectedBap?.releases);
	const { isAddFromSpotifyModal, isAddNewReleaseModal } = useSelector(state => state.user);
	const [isExistingReleaseModal, setIsExistingReleaseModal] = useState(false);
	const [isSyncSpotifyModal, setIsSyncSpotifyModal] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const normalizedFilterValue = searchValue?.toLowerCase().trim();

	const filteredReleases = normalizedFilterValue
		? releases?.filter(release => release.name.toLowerCase().includes(normalizedFilterValue))
		: releases;
	const handleChange = e => {
		setSearchValue(e.target.value);
	};

	const closeBandSpotifyModal = () => {
		setIsSyncSpotifyModal(false);
		setIsExistingReleaseModal(true);
	};

	useEffect(() => {
		dispatch(resetSelectedRelease());
	}, [dispatch, selectedBap?.bapId]);
	const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;

	return (
		<>
			<Flex justifyContent='space-between' mb='16px'>
				{releases?.length.length > 4 && (
					<CustomInput
						icon={SearchIcon}
						maxW='350px'
						mr='10px'
						placeholder='Search'
						value={searchValue}
						onChange={handleChange}
						name='searchValue'
					/>
				)}
				{creatorOrAdmin && (
					<PlusButton
						title='Add release'
						onClickHandler={() => {
							dispatch(setIsAddNewReleaseModal(true));
						}}
					/>
				)}
			</Flex>
			{releases?.length < 1 ? (
				<Flex align='center' justify='center' h='calc(100% - 72px)'>
					<Text color='black' fontSize='18px' fontWeight='600'>
						You don&apos;t have any releases in this B.A.P. Add a release to get started.
					</Text>
				</Flex>
			) : (
				<>
					<Flex as='ul' gap='16px' w='100%' flexWrap='wrap'>
						{filteredReleases?.map(release => (
							<ReleaseCard key={release.id} release={release} page='releases' />
						))}
					</Flex>

					{filteredReleases?.length < 1 && normalizedFilterValue && (
						<Text mt='20px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
							Can not find release
						</Text>
					)}
				</>
			)}

			{isAddNewReleaseModal && (
				<AddReleaseModal
					setIsExistingReleaseModal={setIsExistingReleaseModal}
					handleNewRelease={handleNewRelease}
				/>
			)}
			{isExistingReleaseModal && (
				<ChooseExistingReleaseModal
					setIsExistingReleaseModal={setIsExistingReleaseModal}
					setIsSyncSpotifyModal={setIsSyncSpotifyModal}
					handleNewRelease={handleNewRelease}
				/>
			)}
			{isSyncSpotifyModal && (
				<BandSearchInSpotify isBapInfoPage={false} closeBandSpotifyModal={closeBandSpotifyModal} />
			)}
			{isAddFromSpotifyModal && <AddReleaseFromSpotifyModal handleNewRelease={handleNewRelease} />}
		</>
	);
};

export default ReleasesList;
