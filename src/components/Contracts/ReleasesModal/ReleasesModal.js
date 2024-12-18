import { useRouter } from 'next/router';

import { Box, Flex, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomModal from '@/components/Modals/CustomModal';
import ReleaseCard from '@/components/Releases/ReleaseCard/ReleaseCard';

import SearchIcon from '@/assets/icons/base/search.svg';

const ReleasesModal = ({ closeModal }) => {
	const { pathname } = useRouter();
	const releases = useSelector(state => state.user.selectedBap?.releases);
	const [searchValue, setSearchValue] = useState('');
	const normalizedFilterValue = searchValue?.toLowerCase().trim();

	const isReleasePage = pathname.includes('/releases');
	const actualReleases = isReleasePage
		? releases
		: releases?.filter(el => el.releaseSpotifyId === null);
	const sortedReleases = actualReleases
		? [...actualReleases]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		: [];
	const filteredReleases = normalizedFilterValue
		? sortedReleases?.filter(release => release.name.toLowerCase().includes(normalizedFilterValue))
		: sortedReleases;

	const handleChange = e => {
		setSearchValue(e.target.value);
	};

	return (
		<CustomModal closeModal={closeModal} maxW='928px' maxH='90vh' w='80vw' p='40px 26px 40px 40px'>
			<Box pr='14px'>
				<Text fontSize='32px' fontWeight='600' color='black' textAlign='center'>
					Choose Release
				</Text>

				{actualReleases?.length > 1 && (
					<Flex justifyContent='space-between' mt='16px'>
						<CustomInput
							name='search-release'
							icon={SearchIcon}
							maxW='404px'
							placeholder='Search'
							value={searchValue}
							onChange={handleChange}
						/>
					</Flex>
				)}
			</Box>
			{actualReleases?.length < 1 ? (
				<Flex justify='center' align='center' h='200px' pr='14px'>
					<Text mt='24px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
						You don&apos;t have any releases in this B.A.P.
					</Text>
				</Flex>
			) : (
				<>
					<Flex
						as='ul'
						alignItems='space-between'
						gap='16px'
						w='100%'
						flexWrap='wrap'
						h='calc(90vh - 224px)'
						maxH='416px'
						overflowY='scroll'
						pr='8px'
						mt='24px'
					>
						{filteredReleases?.map(release => (
							<ReleaseCard key={release.id} release={release} w='200px' h='200px' page='contract' />
						))}
					</Flex>

					{filteredReleases?.length < 1 && normalizedFilterValue && (
						<Flex justify='center' align='center' h='200px'>
							<Text mt='20px' color='black' fontSize='18px' fontWeight='600' textAlign='center'>
								Can not find release
							</Text>
						</Flex>
					)}
				</>
			)}
		</CustomModal>
	);
};

export default ReleasesModal;
