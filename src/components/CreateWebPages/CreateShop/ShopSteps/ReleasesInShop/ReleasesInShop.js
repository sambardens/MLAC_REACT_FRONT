import { Box, Flex, Heading, Icon, Text } from '@chakra-ui/react';

import { useState } from 'react';
import { useSelector } from 'react-redux';

import plusIcon from '@/assets/icons/shop/plus.svg';

import ReleasesSelectionModal from './components/ReleasesSelectionModal';
import SelectedReleaseCard from './components/SelectedReleaseCard';

const ReleasesInShop = () => {
	const selectedShopReleases = useSelector(state => state.shop.selectedShopReleases);
	const [isReleasesModal, setIsReleasesModal] = useState(false);

	const sortedShopReleases =
		selectedShopReleases?.length > 0 ? [...selectedShopReleases].sort((a, b) => b.id - a.id) : [];

	return (
		<>
			<Box mb='32px' h='fit-content'>
				<Heading as='h3' mb='4px' fontSize='18px' fontWeight='500' lineHeight='1.5'>
					Releases
				</Heading>
				<Text fontSize='14px' fontWeight='400' color='secondary' mb='16px'>
					Choose a release to add to your shop
				</Text>
				{selectedShopReleases?.length > 0 && (
					<Flex as='ul' gap='8px' flexDir='column'>
						{selectedShopReleases.map(rel => {
							return <SelectedReleaseCard key={rel.id} release={rel} />;
						})}
					</Flex>
				)}

				<Flex
					ml='auto'
					onClick={() => {
						setIsReleasesModal(!isReleasesModal);
					}}
					alignItems={'center'}
					justifyContent={'center'}
					w='56px'
					h='56px'
					mt='8px'
					borderRadius={'10px'}
					bg={'bg.secondary'}
					cursor={'pointer'}
				>
					<Icon as={plusIcon} w='18px' h='18px' />
				</Flex>
			</Box>
			{isReleasesModal && <ReleasesSelectionModal closeModal={() => setIsReleasesModal(false)} />}
		</>
	);
};

export default ReleasesInShop;
