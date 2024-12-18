import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAxiosPrivate } from 'src/functions/customHooks/useAxiosPrivate';
import { linksSelectors } from 'store/links';
import { changeBapSocialLinks } from 'store/links/links-operations';
import { editBapSomeFields } from 'store/operations';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomSelect from '@/components/CustomInputs/CustomSelect';
import ContainerLoader from '@/components/Loaders/ContainerLoader';

import countries from '@/assets/countries.json';

import MenuTitle from '../MenuTitle/MenuTitle';

import DistribureReleaseCard from './DistribureReleaseCard/DistribureReleaseCard';
import DistributeReleaseInfo from './DistribureReleaseInfo/DistributeReleaseInfo';
import DistributeTrack from './DistributeTrack/DistributeTrack';
import EvearaBlock from './EvearaBlock/EvearaBlock';

const DistributeMenu = () => {
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
	const getToast = (type, text) => {
		toast({
			position: 'top',
			title: type === 'Error' ? 'Error' : type,
			description: text || '',
			status: type === 'Error' ? 'error' : 'success',
			duration: 8000,
			isClosable: true,
		});
	};
	const [country, setCountry] = useState('');
	const [isSavingCountry, setIsSavingCountry] = useState(false);
	const [soundCloudId, setSoundCloudId] = useState('');
	const [isSavingSoundCloudId, setIsSavingSoundCloudId] = useState(false);
	const { selectedRelease, selectedBap, user } = useSelector(state => state.user);
	const [tracksInDeals, setTracksInDeals] = useState([]);
	const { evearaGenreIds, checkedTracks, artwork } = selectedRelease;
	const [usersWithoutPaymentEmail, setUsersWithoutPaymentEmail] = useState([]);

	const socialLinks = useSelector(linksSelectors.getSocialLinks);
	const soundCloudLink = socialLinks.find(el => el.social.includes('https://soundcloud.com'));

	const dispatch = useDispatch();

	const handleSelectCountry = ({ value }) => {
		setCountry(value);
	};

	const handleChangeSoundCloudId = e => {
		const { value } = e.target;
		const normalizedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
		setSoundCloudId(normalizedValue);
	};

	const handleSaveBapInfo = async bapData => {
		setIsSavingCountry(true);
		const editRes = await dispatch(editBapSomeFields({ bapId: selectedBap.bapId, bapData }));
		if (editRes?.payload?.error) {
			getToast(
				'Error',
				`Something went wrong. Country has been not saved. ${editRes?.payload?.error}`,
			);
		}
		setIsSavingCountry(false);
	};

	const handleSaveSoundcloudLink = async () => {
		const socialData = [
			...socialLinks,
			{ social: `https://soundcloud.com/${soundCloudId}`, position: socialLinks.length + 1 },
		];
		setIsSavingSoundCloudId(true);
		const res = await dispatch(changeBapSocialLinks({ bapId: selectedBap?.bapId, socialData }));
		if (!res?.payload?.success) {
			getToast(
				'error',
				'Error',
				'Something went wrong. SoundCloud link has been not saved. Please try again later.',
			);
		}
		setIsSavingSoundCloudId(false);
	};

	const releaseTracks = selectedRelease.checkedTracks;

	const activeDeals = selectedRelease?.splitsAndContracts?.filter(el => el.status === 1);
	const isTracksWithoutDeals = releaseTracks.length !== tracksInDeals.length;
	const artistWithoutCountry = !selectedBap.country;
	const releaseWithoutLabel = !selectedRelease.label;
	const releaseWithouDate = !selectedRelease.distributeDate;
	const releaseWithoutGenres = !evearaGenreIds || evearaGenreIds?.length === 0;
	const isDisabled =
		!user.participants ||
		artistWithoutCountry ||
		releaseWithoutLabel ||
		isTracksWithoutDeals ||
		releaseWithouDate ||
		releaseWithoutGenres ||
		!user?.lastName ||
		usersWithoutPaymentEmail.length > 0 ||
		artwork?.error;

	useEffect(() => {
		(function getTracksList() {
			const addedTracks = [];

			activeDeals.forEach(deal => {
				deal.splitTracks.forEach(track => {
					const existingResultEntry = addedTracks.find(
						addedTrack => addedTrack.trackId === track.trackId,
					);

					if (existingResultEntry) {
						const userIdsInExistingEntry = existingResultEntry.splitUsers.map(user => user.email);
						deal.splitUsers.forEach(user => {
							if (!userIdsInExistingEntry.includes(user.email)) {
								existingResultEntry.splitUsers.push(user);
							}
						});
					} else {
						addedTracks.push({
							...track,
							splitUsers: [...deal.splitUsers],
						});
					}
				});
			});
			setTracksInDeals(addedTracks);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (tracksInDeals.length > 0) {
			const res = [];

			tracksInDeals.forEach(track => {
				track.splitUsers.forEach(splitUser => {
					if (!splitUser.paymentEmail) {
						if (!res.some(el => el.email === splitUser.email)) {
							res.push(splitUser);
						}
					}
				});
			});

			if (res.length > 0) {
				const names = res.map(el =>
					el.userId ? `${el.firstName} ${el.lastName}` : `${el.email}(unregistered)`,
				);
				setUsersWithoutPaymentEmail(names);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tracksInDeals.length]);

	return (
		<Flex flexDir='column' justify='space-between' h='100%'>
			<Box>
				<MenuTitle
					title='Distribute your music with Major Labl'
					text='Distribute your release using our platform'
				/>
				{!isLoading && (
					<>
						<DistribureReleaseCard />
						<DistributeReleaseInfo />

						{checkedTracks?.length > 0 && (
							<>
								<Heading as='h3' fontWeight='600' fontSize='18px' mb='16px' color='black' pl='12px'>
									Track details
								</Heading>
								<Flex as='ul' flexDir='column' gap='16px'>
									{checkedTracks?.map((track, index) => (
										<DistributeTrack key={track.uniqueName} track={track} index={index} />
									))}
								</Flex>
							</>
						)}
					</>
				)}
			</Box>

			{!isLoading && (!soundCloudLink || isDisabled) && (
				<Flex
					gap='16px'
					flexDir='column'
					mt='16px'
					px='24px'
					py='16px'
					bg='bg.light'
					borderRadius='10px'
					maxW='500px'
				>
					{!soundCloudLink && (
						<Box>
							<Text mb='4px' color='black' fontSize='16px'>
								Add your Soundcloud line [Optional]
							</Text>
							<Flex gap='12px'>
								<CustomInput
									value={soundCloudId}
									onChange={handleChangeSoundCloudId}
									name='soundCloudId'
									placeholder='Enter name'
								/>
								<CustomButton
									minW='150px'
									styles={soundCloudId ? 'main' : 'disabled'}
									onClickHandler={handleSaveSoundcloudLink}
									isSubmiting={isSavingSoundCloudId}
								>
									Save
								</CustomButton>
							</Flex>

							<Text
								fontSize='16px'
								fontWeight='400'
								color={soundCloudId ? 'black' : 'secondary'}
								mt='4px'
								pl='12px'
							>
								https://soundcloud.com/
								<Text as='span' color='accent'>
									{soundCloudId || 'name'}
								</Text>
							</Text>
						</Box>
					)}
					{artistWithoutCountry && (
						<Flex gap='16px' py='16px' flexDir='column' bg='bg.light' borderRadius='10px' maxW='500px'>
							<Box>
								<Text fontSize='16px' mb='4px' color='accent' fontWeight='400'>
									*Country of the B.A.P. is required for distribution
								</Text>
								<Flex gap='12px' align='center' w='100%'>
									<CustomSelect
										options={countries.list}
										name='country'
										value={country}
										placeholder='Select'
										onChange={handleSelectCountry}
										hControl='fit-content'
										isTop={true}
										menuListTopHeight='- 12'
									/>
									<CustomButton
										minW='150px'
										styles={country ? 'main' : 'disabled'}
										onClickHandler={() => handleSaveBapInfo({ country })}
										isSubmiting={isSavingCountry}
									>
										Save
									</CustomButton>
								</Flex>
							</Box>
						</Flex>
					)}

					{!user?.lastName && (
						<Text fontSize='16px' color='accent' fontWeight='400'>
							*Last name is required
						</Text>
					)}
					{releaseWithoutLabel && (
						<Text fontSize='16px' color='accent' fontWeight='400'>
							*Label is required
						</Text>
					)}
					{isTracksWithoutDeals && (
						<Text fontSize='16px' color='accent' fontWeight='400'>
							*All tracks must be included in split or active contract.
						</Text>
					)}
					{releaseWithouDate && (
						<Text fontSize='16px' color='accent' fontWeight='400'>
							*Start date of distribution is required
						</Text>
					)}

					{releaseWithoutGenres && (
						<Text fontSize='16px' color='accent' fontWeight='400'>
							*Release genre is required
						</Text>
					)}
					{artwork?.error && (
						<Text fontSize='16px' color='accent' fontWeight='400'>
							The artwork image can range from 1400px to 4000px and file size should be between 100KB and
							10 MB. Your artwork is currently {artwork.size}px and {artwork.weight}KB. Please change it
							for distribution.
						</Text>
					)}
					{usersWithoutPaymentEmail.length > 0 && (
						<Text fontSize='16px' color='accent' fontWeight='400'>
							*
							{usersWithoutPaymentEmail.length === 1
								? `User ${usersWithoutPaymentEmail[0]} don't specify payment email.`
								: `Payment email are missing for ${usersWithoutPaymentEmail.join(', ')}`}
						</Text>
					)}
				</Flex>
			)}
			{isLoading && (
				<Flex align='center' justify='center' pos='relative' flexDir='column' h='100%'>
					<ContainerLoader h='auto' />
					<Text fontSize='18px' fontWeight='500' color='accent' mt='40px'>
						It can take some time. Please wait...
					</Text>
				</Flex>
			)}

			<EvearaBlock
				isDisabled={isDisabled}
				tracksInDeals={tracksInDeals}
				isLoading={isLoading}
				setIsLoading={setIsLoading}
				soundCloudLink={soundCloudLink}
			/>
		</Flex>
	);
};

export default DistributeMenu;
