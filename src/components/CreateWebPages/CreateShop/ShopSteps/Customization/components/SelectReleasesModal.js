import { Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import CustomModal from '@/components/Modals/CustomModal';

import PreviewReleaseCard from '../../../PreviewComponent/components/PreviewReleaseCard';

const SelectReleasesModal = ({ closeModal }) => {
	const releases = useSelector(state => state.shop.selectedShopReleases);

	return (
		<CustomModal closeModal={closeModal} minH='316px'>
			{releases.length < 1 && (
				<Text
					position={'absolute'}
					top='50%'
					right='50%'
					transform={'translate(50%, -50%)'}
					fontWeight={'600'}
					fontSize='18px'
					textAlign={'center'}
				>
					Select at least one release in the
					<br />
					&quot;Add release&quot; tab
				</Text>
			)}

			{releases.length > 0 && (
				<>
					<Text textAlign={'center'} fontWeight={'600'} fontSize={'24px'}>
						Please select the release you want to customize
					</Text>
					<Flex flexWrap='wrap' h='fit-content' maxH='366px' overflowY='scroll' gap='10px' mt='16px'>
						{releases?.map(rel => (
							<PreviewReleaseCard key={rel.id} rel={rel} closeModal={closeModal} />
						))}
					</Flex>
				</>
			)}
		</CustomModal>
	);
};

export default SelectReleasesModal;
