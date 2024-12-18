import { Box, Flex, Text } from '@chakra-ui/react';

import CustomButton from '../Buttons/CustomButton';
import CustomInput from '../CustomInputs/CustomInput';
import CustomSelect from '../CustomInputs/CustomSelect';

import CustomModal from './CustomModal';
import { poppins_400_16_24, poppins_500_18_27, poppins_600_32_48 } from '@/styles/fontStyles';

const DeleteModal = ({
	closeModal,
	deleteHandler,
	title,
	text,
	description,
	isLoadingDelete = false,
	isBapDeletion = false,
	isMultiUsers = false,
	setCandidateEmail,
	candidateEmail,
	membersOptions,
}) => {
	return (
		<CustomModal closeModal={closeModal}>
			<Flex flexDir='column'>
				<Text color={'textColor.black'} sx={poppins_600_32_48}>
					{title}
				</Text>

				<Text color={'textColor.black'} sx={poppins_500_18_27} mt={'24px'}>
					{text}
				</Text>

				<Text color='secondary' sx={poppins_400_16_24} mt={'8px'}>
					{description}
				</Text>

				{isMultiUsers && isBapDeletion && (
					<Box mt='16px'>
						{membersOptions?.length > 1 ? (
							<>
								<Text color='secondary' sx={poppins_400_16_24} mb='8px'>
									Choose the email of the B.A.P. member to whom you want to transfer the rights of the B.A.P.
									owner
								</Text>
								<CustomSelect
									name='candidate_email'
									options={membersOptions}
									value={candidateEmail}
									onChange={e => setCandidateEmail(e.value)}
								/>
							</>
						) : (
							<>
								<Text color='secondary' sx={poppins_400_16_24} mb='8px'>
									You transfer B.A.P. owner rights to this member
								</Text>
								<CustomInput name='candidateEmail' value={candidateEmail} readOnly={true} />
							</>
						)}
					</Box>
				)}

				<Flex justifyContent={'end'} alignItems={'center'} mt='24px'>
					<Flex>
						<CustomButton onClickHandler={deleteHandler} isSubmiting={isLoadingDelete}>
							Delete
						</CustomButton>
						<CustomButton styles={'light'} onClickHandler={closeModal} ml={'16px'}>
							Cancel
						</CustomButton>
					</Flex>
				</Flex>
			</Flex>
		</CustomModal>
	);
};

export default DeleteModal;
