import { Flex, Text } from '@chakra-ui/react';

const AddBapBtn = ({ mt, onClick, isMenuWide }) => {
	return (
		<Flex
			onClick={onClick}
			justifyContent={'center'}
			alignItems={'center'}
			mt={mt}
			w='100%'
			h={isMenuWide ? '56px' : '64px'}
			borderRadius={'14px'}
			cursor='pointer'
			bg='accent'
			color='white'
		>
			<Text fontSize={'30px'} lineHeight={'30px'}>
				+
			</Text>

			{isMenuWide && (
				<Text ml='15px' fontSize={'16px'}>
					New B.A.P.
				</Text>
			)}
		</Flex>
	);
};

export default AddBapBtn;
