import { Flex, Icon, Input } from '@chakra-ui/react';

import searchIcon from '@/assets/icons/base/search.svg';

const SearchBtn = ({ setSearchQuery, searchQuery, setIsMenuWide, isMenuWide, mt }) => {
	return (
		<Flex
			onClick={() => setIsMenuWide(true)}
			justifyContent={'center'}
			alignItems={'center'}
			mt={mt}
			p='12px'
			w='100%'
			h={isMenuWide ? '56px' : '64px'}
			border='1px solid white'
			color='white'
			borderRadius={'14px'}
			cursor='pointer'
			bg='black'
		>
			<Icon as={searchIcon} w='24px' h='24px' />
			{isMenuWide && (
				<Input
					onChange={e => setSearchQuery(e.target.value)}
					value={searchQuery}
					placeholder='Search'
					name='search'
					ml='14px'
					border='none'
					_focus={{ boxShadow: 'none' }}
				/>
			)}
		</Flex>
	);
};

export default SearchBtn;
