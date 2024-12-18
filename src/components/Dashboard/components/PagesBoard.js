import { useRouter } from 'next/router';

import { Box, Flex, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import СreateLandingPageModalStepOne from '@/components/Modals/СreateLandingPageModal/СreateLandingPageModalStepOne';
import СreateLandingPageModalStepTwo from '@/components/Modals/СreateLandingPageModal/СreateLandingPageModalStepTwo';

import BoardLayout from './BoardLayout';
import CreateWebPageModal from './CreateWebPageModal';
import WebpageCard from './WebpageCard';

const PagesBoard = ({ isLoading }) => {
	const { selectedBap } = useSelector(state => state.user);

	const { pathname, push } = useRouter();
	const [currentStep, setCurrentStep] = useState(null);

	const landingPages = selectedBap?.landingPages;
	const sortedPages = landingPages?.length > 0 ? [...landingPages]?.sort((a, b) => b.id - a.id) : [];
	const shops = selectedBap?.shops;
	const sortedShops = shops?.length > 0 ? [...shops]?.sort((a, b) => b.id - a.id) : null;
	const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;

	return (
		<BoardLayout onClick={() => setCurrentStep(1)} title={'Web pages'} ariaLabel='web-page'>
			{/* {isLoading && <FullPageLoader position='absolute' />} */}
			{!isLoading && (
				<Flex position='relative' flexDir='column' h='100%' gap='16px' mt='16px'>
					{shops?.length > 0 && (
						<Box>
							<Text p='8px 12px' color='secondary' fontSize='14px' fontWeight='400'>
								Your shop
							</Text>
							<Flex flexDir={'column'} as='ul' gap='16px'>
								{sortedShops.map(shop => {
									return <WebpageCard key={shop.name} web={shop} webType={'shop'} alt='Web shop image' />;
								})}
							</Flex>
						</Box>
					)}

					{landingPages?.length > 0 && (
						<Box>
							<Text p='8px 12px' color='secondary' fontSize='14px' fontWeight='400'>
								Your landing pages
							</Text>
							<Flex flexDir='column' as='ul' gap='16px'>
								{sortedPages.map(el => (
									<WebpageCard
										onClick={() => push(`/music/${el.name}`)}
										key={el.name}
										web={el}
										webType='landing'
										alt='Landing page image'
										p='0 0 0 12px'
									/>
								))}
							</Flex>
						</Box>
					)}

					{!shops?.length && !landingPages?.length && (
						<Flex align='center' justify='center' h='100%'>
							<Text color='secondary' fontSize='16px' fontWeight='400' maxW='340px' textAlign='center'>
								There are no web pages in this B.A.P.
								{creatorOrAdmin && selectedBap.releases?.length === 0 && ' Add a release to get started'}
							</Text>
						</Flex>
					)}
				</Flex>
			)}

			{currentStep === 1 && <CreateWebPageModal setCurrentStep={setCurrentStep} />}
			{currentStep === 2 && (
				<СreateLandingPageModalStepOne
					closeModal={() => setCurrentStep(null)}
					openStepTwoModal={() => setCurrentStep(3)}
				/>
			)}
			{currentStep === 3 && <СreateLandingPageModalStepTwo closeModal={() => setCurrentStep(null)} />}
		</BoardLayout>
	);
};

export default PagesBoard;
