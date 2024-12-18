import { Box, Flex, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import addCredit from 'src/functions/serverRequests/splits/addCredit';
import deleteCredit from 'src/functions/serverRequests/splits/deleteCredit';
import getUserName from 'src/functions/utils/getUserName';

import CustomSelect from '@/components/CustomInputs/CustomSelect';

const CreditSelect = ({ track, options, setSplitTracks, splitTracks, isLast, tracksNumber }) => {
	const { selectedSplit } = useSelector(state => state.user.selectedRelease);
	const [creditsInfo, setCreditsInfo] = useState({});
	const handleSelect = async (selectedCredits, userId) => {
		const splitId = selectedSplit?.splitId;
		const trackId = track.id;
		if (creditsInfo[userId].length < selectedCredits.length) {
			const selectedOption = selectedCredits.find(credit => {
				return !creditsInfo[userId].some(el => {
					return el.id === credit.id;
				});
			});
			const res = await addCredit({
				creditTypeId: selectedOption.id,
				trackId,
				splitId,
				userId,
			});

			if (res?.success) {
				setCreditsInfo(prev => {
					return {
						...prev,
						[userId]: [...prev[userId], selectedOption],
					};
				});

				const updatedTracks = splitTracks.map(track => {
					return track.id === res.credit.trackId
						? {
								...track,
								splitUsers: track.splitUsers.map(user =>
									user.userId === res.credit.userId
										? { ...user, credits: [...user.credits, selectedOption] }
										: user,
								),
						  }
						: track;
				});
				setSplitTracks(updatedTracks);
			}
		} else {
			const selectedOption = creditsInfo[userId].find(
				credit => !selectedCredits.some(el => el.id === credit.id),
			);

			const res = await deleteCredit({
				splitId,
				userId,
				trackId,
				creditTypeId: selectedOption.id,
			});
			if (res?.success) {
				setCreditsInfo(prev => ({
					...prev,
					[userId]: creditsInfo[userId].filter(el => el.id !== selectedOption.id),
				}));
				const updatedTracks = splitTracks.map(track =>
					track.id === res.trackId
						? {
								...track,
								splitUsers: track.splitUsers.map(user =>
									user.userId === res.userId
										? {
												...user,
												credits: user.credits.filter(el => el.creditTypeId !== res.creditTypeId),
										  }
										: user,
								),
						  }
						: track,
				);
				setSplitTracks(updatedTracks);
			}
		}
	};

	// const getFilteredOptions = userId => {
	// 	const selected = creditsInfo[userId];
	// 	if (selected?.length > 0) {
	// 		const isNoCredit = selected.find(track => track.id === 1);
	// 		return isNoCredit
	// 			? options.filter(el => el.id === 1)
	// 			: options.filter(el => el.id !== 1);
	// 	} else {
	// 		return options;
	// 	}
	// };
	// console.log('getFilteredOptions: ', getFilteredOptions(369));

	useEffect(() => {
		let initialState = {};
		track.splitUsers.forEach(user => {
			initialState = { ...initialState, [user.userId]: [...user.credits] };
		});
		setCreditsInfo(initialState);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Flex as='ul' gap='20px' flexDir='column'>
			{track.splitUsers.map((user, i) => {
				const isUserToDeleteFromContract = user.ownership === '0';
				return (
					<Box as='li' key={`${user.email}credit`}>
						<Flex justifyContent='space-between' mb='10px'>
							<Text fontSize='16px' fontWeight='500' color='black'>
								{getUserName(user)}
							</Text>
							<Text fontSize='16px' fontWeight='400' color='black'>
								{user.ownership}%
							</Text>
						</Flex>
						{user?.userId ? (
							<>
								<CustomSelect
									isMulti={true}
									placeholder='Add credit'
									onChange={selectedOptions => {
										handleSelect(selectedOptions, user.userId);
									}}
									mb='10px'
									name={user.id}
									label='Credit'
									options={options}
									selectedOptions={creditsInfo[user.userId]}
									// value={creditsInfo[user.id]?.value}
									value={creditsInfo[user.userId]}
									readOnly={isUserToDeleteFromContract}
									isTop={
										isLast &&
										(track.splitUsers.length > 1 || tracksNumber > 1) &&
										i === track.splitUsers.length - 1
									}
								/>
								{isUserToDeleteFromContract && (
									<Text fontSize='16px' fontWeight='400' color='accent'>
										You can&apos;t change credit to writer with ownership 0%
									</Text>
								)}
							</>
						) : (
							<Text fontSize='16px' fontWeight='400' color='accent'>
								You can&apos;t add credit to unregistered user
							</Text>
						)}
					</Box>
				);
			})}
		</Flex>
	);
};

export default CreditSelect;
