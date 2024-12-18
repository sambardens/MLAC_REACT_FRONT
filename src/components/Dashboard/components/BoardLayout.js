import { Flex, IconButton, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

import PlusIcon from '@/assets/icons/base/plus.svg';

const BoardLayout = ({ title, children, onClick, ariaLabel }) => {
	const { selectedBap } = useSelector(state => state.user);
	const creatorOrAdmin = selectedBap?.isCreator || selectedBap?.isFullAdmin;

	const canAdd = creatorOrAdmin && (title === 'Members' || selectedBap.releases?.length > 0);
	return (
		<Flex
			position={'relative'}
			flexDir={'column'}
			h='100%'
			w='50%'
			p='16px'
			bgColor={'white'}
			borderRadius={'20px'}
		>
			<Flex justify={'space-between'} align={'center'} w='100%' pl='12px' minH='40px'>
				<Text fontSize={'18px'} fontWeight={'600'} color='black'>
					{title}
				</Text>

				{canAdd && (
					<IconButton
						borderRadius='10px'
						aria-label={`Add ${ariaLabel}`}
						icon={<PlusIcon />}
						color='accent'
						bg='bg.secondary'
						_hover={{ bg: 'stroke' }}
						transition='0.3s linear'
						onClick={onClick}
					/>
				)}
			</Flex>
			{children}
		</Flex>
	);
};

export default BoardLayout;
