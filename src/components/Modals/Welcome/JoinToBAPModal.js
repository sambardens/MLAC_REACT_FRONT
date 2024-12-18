import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';

import { useEffect, useState } from 'react';

import BackArrowIcon from '@/assets/icons/modal/backArrow.svg';
import NextArrowIcon from '@/assets/icons/modal/nextArrow.svg';

import { joinVariantMockData } from '../../mockData/joinBAPmockData';
import CustomModal from '../CustomModal';
import { JoinVariant } from '../components/JoinVariant';
import StageScale from '../components/StageScale';

import { poppins_500_16_24 } from '@/styles/fontStyles';

export const JoinToBAPModal = ({ closeModal, goBack, setCurrentModal }) => {
	const [selectedOptions, setSelectedOptions] = useState(1);

	const nextButtonHandler = () => {
		if (selectedOptions === 1) {
			setCurrentModal('createBap');
		}

		if (selectedOptions === 2) {
			setCurrentModal('inviteLink');
		}

		if (selectedOptions === 3) {
			setCurrentModal(null);
		}
	};

	return (
		<CustomModal
			closeModal={() => closeModal()}
			closeOnOverlayClick={false}
			// isCentered={false}
			maxW='1170px'
			maxH='725px'
			w='90vw'
			h='90vh'
			bgImage={'/assets/images/Jeyaia.png'}
		>
			<Flex
				flexDir={'column'}
				justifyContent={'space-between'}
				alignItems='start'
				w={'635px'}
				h='100%'
			>
				<Box>
					<Text fontSize={'32px'} fontWeight='600'>
						Welcome to
						<Box as='span' ml='10px' color='accent'>
							Major Labl Artist Club
						</Box>
					</Text>
					<Flex w='100%' mt='24px'>
						<StageScale isRed={true} />
						<StageScale isRed={true} />
						<StageScale />
					</Flex>
					<Text mt='24px' fontSize={'18px'} fontWeight={'500'}>
						2.Band / Artist / Project (B.A.P.)
					</Text>
					<Text mt='8px' fontSize={'16px'} fontWeight={'400'} color='brand.textGray'>
						Band/Artist/Project
					</Text>
					<Flex flexDirection={'column'} gap={'16px'} mt={'16px'} w={'100%'}>
						{joinVariantMockData.map(item => {
							return (
								<JoinVariant
									item={item}
									key={item?.id}
									handler={setSelectedOptions}
									selectedOptions={selectedOptions}
								/>
							);
						})}
					</Flex>
				</Box>

				<Flex alignItems={'center'} justifyContent={'space-between'} mt={'24px'} w='100%'>
					<Button
						sx={poppins_500_16_24}
						color={'textColor.red'}
						bg={'transparent'}
						leftIcon={<BackArrowIcon />}
						pl={'40px'}
						_hover={{}}
						_focus={{}}
						_active={{}}
						onClick={goBack}
					>
						Back
					</Button>
					<Button
						sx={poppins_500_16_24}
						color={'textColor.white'}
						bg={'bg.red'}
						w={'150px'}
						h={'56px'}
						rightIcon={<NextArrowIcon />}
						_hover={{}}
						_focus={{}}
						_active={{}}
						onClick={nextButtonHandler}
					>
						Next
					</Button>
				</Flex>
			</Flex>
		</CustomModal>
	);
};
