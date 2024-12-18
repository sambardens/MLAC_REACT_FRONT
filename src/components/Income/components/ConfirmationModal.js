import { Flex, Heading, Text } from '@chakra-ui/react';

import CustomButton from '@/components/Buttons/CustomButton';
import CustomModal from '@/components/Modals/CustomModal';

const ConfirmationModal = ({ closeModal, onClickHandler, isLoading }) => {
	return (
		<CustomModal maxW='692px' closeModal={closeModal}>
			<Heading fontSize='32px' fontWeight='600' mb='24px'>
				Confirm
			</Heading>
			<Text fontSize='18px' fontWeight='500' color='black' mb='8px'>
				Are you sure you want to withdraw money for distribution?
			</Text>

			<Flex justify='flex-end' mt='24px'>
				<CustomButton onClickHandler={onClickHandler} isSubmiting={isLoading}>
					Confirm
				</CustomButton>
				<CustomButton styles={'light'} ml='16px' onClickHandler={closeModal}>
					Cancel
				</CustomButton>
			</Flex>
		</CustomModal>
	);
};

export default ConfirmationModal;
