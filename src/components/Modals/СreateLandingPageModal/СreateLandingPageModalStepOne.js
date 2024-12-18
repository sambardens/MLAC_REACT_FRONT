import { useRouter } from 'next/router';

import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import CustomInput from '@/components/CustomInputs/CustomInput';
import ContainerLoader from '@/components/Loaders/ContainerLoader';
import CustomModal from '@/components/Modals/CustomModal';
import ProgressLine from '@/components/ProgressLine/ProgressLine';
import ReleaseCard from '@/components/Releases/ReleaseCard/ReleaseCard';

import SearchIcon from '@/assets/icons/base/search.svg';

const СreateLandingPageModalStepOne = ({ closeModal, openStepTwoModal }) => {
	const releases = useSelector(state => state.user.selectedBap?.releases);
	const [searchValue, setSearchValue] = useState('');
	const { pathname } = useRouter();
	const normalizedFilterValue = searchValue?.toLowerCase().trim();
	const [isLoading, setIsLoading] = useState(false);

	const filteredReleases = normalizedFilterValue
		? releases?.filter(release => release.name.toLowerCase().includes(normalizedFilterValue))
		: releases;
	const handleChange = e => {
		setSearchValue(e.target.value);
	};
	const isWebPage = pathname.includes('/web-pages');
	return (
		<CustomModal closeModal={closeModal} maxW='928px' maxH='90vh' w='80vw' p='40px 26px 40px 40px'>
			<Box pr='14px'>
				<Heading as='h3' fontSize='32px' fontWeight='600' color='black' lineHeight='1.5'>
					Create a landing page
				</Heading>
				{isWebPage && (
					<Flex mt='16px' gap='4px'>
						<ProgressLine n={0} currentStep={1} />
						<ProgressLine n={1} currentStep={1} />
					</Flex>
				)}
				<Box mt='24px'>
					<Text fontSize='18px' fontWeight='500' color='black' mb='8px'>
						1.Choose release
					</Text>
					<Text fontSize='16px' fontWeight='400' color='secondary'>
						Choose the release you want to create a landing page for.
					</Text>
				</Box>
				{releases?.length > 4 && (
					<Flex justifyContent='space-between' mt='16px'>
						<CustomInput
							icon={SearchIcon}
							maxW='404px'
							placeholder='Search'
							value={searchValue}
							onChange={handleChange}
							name='searchValue'
						/>
					</Flex>
				)}
			</Box>

			{releases?.length < 1 ? (
				<Flex justify='center' align='center' h='200px' mt='24px' pr='14px'>
					<Text color='black' fontSize='18px' fontWeight='600' textAlign='center'>
						You don&apos;t have any releases in this B.A.P. Add a release to get started.
					</Text>
				</Flex>
			) : (
				<>
					{isLoading ? (
						<ContainerLoader p='24px' h='440px' />
					) : (
						<>
							<Flex
								as='ul'
								alignItems='space-between'
								gap='16px'
								w='100%'
								flexWrap='wrap'
								mt='24px'
								overflowY='scroll'
								h='calc(90vh - 331px)'
								maxH='416px'
								pr='8px'
							>
								{filteredReleases?.map(release => (
									<ReleaseCard
										key={release.id}
										release={release}
										w='200px'
										h='200px'
										openStepTwoModal={openStepTwoModal}
										setIsLoading={setIsLoading}
									/>
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
				</>
			)}
		</CustomModal>
	);
};

export default СreateLandingPageModalStepOne;
