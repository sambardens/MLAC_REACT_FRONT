import { useRouter } from 'next/router';

import { Box, Checkbox, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addTrackToSplit, createDealReference } from 'store/operations';

import NextButton from '@/components/Buttons/NextButton/NextButton';

import SplitTrack from '../SplitTrack/SplitTrack';

const AddTracksToSplit = ({
	setCurrentStep,
	setArtists,
	setLocalSplitTracks,
	localSplitTracks,
	oldLocalSplitTracks,
	setLocalOldSplitTracks,
	usersToSplit,
	setAvailableTracksLoaded,
}) => {
	const { user, selectedRelease, selectedBap, allSplitsAndContracts } = useSelector(
		state => state.user,
	);
	const { selectedSplit } = selectedRelease;
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const allChecked = localSplitTracks?.every(el => el.selected === true);
	const isIndeterminate = localSplitTracks?.some(el => el.selected === true) && !allChecked;
	const toast = useToast();
	const { pathname } = useRouter();
	const isReleasePage = pathname.includes('/releases');
	const isContractsAndSplitsPage = pathname.includes('/splits-contracts');
	const isMyContractsAndSplitsPage = pathname.includes('/my-splits-contracts');
	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 6000,
			isClosable: true,
		});
	};

	const getDealList = () => {
		let allDeals;
		if (isReleasePage) {
			allDeals = selectedRelease.splitsAndContracts;
		} else if (isContractsAndSplitsPage) {
			allDeals = selectedBap.splitsAndContracts;
		} else if (isMyContractsAndSplitsPage) {
			allDeals = allSplitsAndContracts;
		}
		return allDeals;
	};

	const handleChange = selectedIndex => {
		setLocalSplitTracks(prev =>
			prev.map((el, i) => (i === selectedIndex ? { ...el, selected: !el.selected } : el)),
		);
	};
	const handleAllChecked = e => {
		const { checked } = e.target;
		setLocalSplitTracks(prev => prev?.map(el => ({ ...el, selected: checked })));
	};
	const checkedSplitTracks = localSplitTracks?.filter(el => el.selected);

	const createSplits = async () => {
		setIsLoading(true);
		const uniqueArtists = checkedSplitTracks
			?.flatMap(track => track.featureArtists)
			?.reduce((acc, curr) => {
				const isDuplicate = acc.some(artist => artist.email === curr.email);
				if (!isDuplicate) {
					acc.push(curr);
				}
				return acc;
			}, []);

		if (usersToSplit?.length > 0) {
			const filteredUniqueArtists = uniqueArtists?.filter(
				artist => !usersToSplit.some(user => user.email === artist.email),
			);
			setArtists(filteredUniqueArtists);
		} else {
			setArtists(uniqueArtists);
		}

		setCurrentStep(2);
		setIsLoading(false);
		// setAvailableTracksLoaded(true);
	};

	return (
		<Flex flexDir='column' justify='space-between' h='100%'>
			<Box w='50%' minW='500px'>
				<Heading fontSize='16px' fontWeight='400' color='accent' mb='40px'>
					You have listed {checkedSplitTracks?.length} track
					{checkedSplitTracks?.length > 1 && 's'}
				</Heading>
				{localSplitTracks?.length > 1 && (
					<Box borderRadius='20px' bg='bg.main' mb='20px'>
						<Checkbox
							id='select_all'
							isChecked={allChecked}
							isIndeterminate={isIndeterminate}
							onChange={handleAllChecked}
							colorScheme='checkbox'
							borderColor='accent'
							size='md'
						>
							<Text fontWeight='400'>Select all tracks</Text>
						</Checkbox>
					</Box>
				)}
				<Flex flexDir='column' gap='8px'>
					{localSplitTracks?.map((track, index) => {
						return (
							<Flex align='center' as='li' key={track.uniqueName}>
								<SplitTrack
									track={track}
									onClick={() => {
										handleChange(index);
									}}
								/>
							</Flex>
						);
					})}
				</Flex>
			</Box>
			{checkedSplitTracks?.length > 0 && (
				<NextButton onClickHandler={createSplits} isSubmiting={isLoading} />
			)}
		</Flex>
	);
};

export default AddTracksToSplit;
