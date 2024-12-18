import { useRouter } from 'next/router';

import { Flex, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import getFormattedDate from 'src/functions/utils/getFormattedDate';

const ReleaseCard = ({ rel, fontForSubtitle, fontForBody }) => {
	// const dispatch = useDispatch();
	const { query, push } = useRouter();
	const shopUser = useSelector(state => state.shopUser);
	// const axiosPrivate = useAxiosPrivate();

	const handleReleaseSelection = async () => {
		push({
			pathname: '/music/shop/[linkName]/[releaseId]',
			query: { linkName: query.linkName, releaseId: rel.id },
		});
		// const newPath = `${asPath}/${rel.id}`;

		// window.open(newPath, '_blank');

		// const preparedRelease = await prepareRelease(rel, axiosPrivate);

		// const updatedShop = { ...shopUser, selectedRelease: preparedRelease };
		// dispatch(setUserShop(updatedShop));
	};

	return (
		<Flex
			onClick={handleReleaseSelection}
			as='li'
			alignItems={'end'}
			minW={{ base: '360px', lg: '300px' }}
			h='fit-content'
			minH={{ base: '360px', lg: '300px' }}
			bgImage={rel.logoSrc}
			bgSize={'cover'}
			bgColor='secondary'
			borderRadius='10px'
			cursor='pointer'
			// boxShadow={'1px 1px 3px Gray'}
		>
			<Flex
				flexDir={'column'}
				w='100%'
				h='fit-content'
				minH='65px'
				p='10px'
				bgColor={'bg.blackSubstrate'}
				color={'white'}
				borderRadius={'0px 0px 10px 10px'}
			>
				<Text
					fontFamily={shopUser.selectedFonts[1].font}
					fontStyle={shopUser.selectedFonts[1].italic}
					fontWeight={shopUser.selectedFonts[1].weight}
					fontSize={shopUser.selectedFonts[1].size}
				>
					{rel.name || rel.title}
				</Text>
				<Text
					mt='7px'
					fontFamily={shopUser.selectedFonts[2].font}
					fontStyle={shopUser.selectedFonts[2].italic}
					fontWeight={shopUser.selectedFonts[2].weight}
					fontSize={shopUser.selectedFonts[2].size * 0.8}
				>
					{getFormattedDate(rel.createdAt)}
				</Text>
			</Flex>
		</Flex>
	);
};

export default ReleaseCard;
