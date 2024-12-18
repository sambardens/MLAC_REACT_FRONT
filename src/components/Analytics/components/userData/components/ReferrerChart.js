import {
	Box,
	Flex,
	Grid,
	Icon,
	ListItem,
	Text,
	Tooltip,
	UnorderedList,
	useClipboard,
	useToast,
} from '@chakra-ui/react';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useCountWithPercentage from 'src/functions/customHooks/useCountWithPercentage';
import { getColorByIndex } from 'src/functions/utils/getColorsByIndex';
import analyticsSelectors from 'store/analytics/analytics-selectors';

import CopyIcon from '@/assets/icons/base/copy.svg';

import { RadiusChart } from './RadiusChart';
import { poppins_400_16_24 } from '@/styles/fontStyles';

export const ReferrerChart = () => {
	const googleAnalytics = useSelector(analyticsSelectors.getAnalyticsDataFromGoogle);
	const deviseDataArray = googleAnalytics?.analytics?.filteredPagePathGoogleResponse;
	const referrerList = useCountWithPercentage(deviseDataArray, 'title', 5, false);
	const toast = useToast();
	const { hasCopied, onCopy } = useClipboard();

	const copyHandler = async link => {
		if (link) {
			await navigator.clipboard.writeText('');
			await navigator.clipboard.writeText(`https://app.majorlabl.com${link}`);
			onCopy();
		}
	};

	useEffect(() => {
		if (hasCopied) {
			toast({
				position: 'top',
				title: 'Link copied',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
		}
	}, [hasCopied, toast]);

	return (
		<Grid
			templateColumns='repeat(2, 1fr)'
			w={'100%'}
			p={'24px'}
			pr={'0px'}
			align={'center'}
			gap={'24px'}
		>
			<RadiusChart data={referrerList} title={'Links'} />
			<UnorderedList w={'100%'} m={'0px'} display={'flex'} flexDir={'column'} gap={'8px'}>
				{referrerList?.map((item, index) => {
					const colorStyle = getColorByIndex(index);
					return (
						<ListItem
							key={item.title}
							w={'100%'}
							sx={{
								color: colorStyle,
								fontSize: '22px',
							}}
						>
							<Flex
								cursor={'pointer'}
								onClick={() => copyHandler(item.title)}
								alignItems={'center'}
								justifyContent={'space-between'}
								w={'100%'}
								gap={'5px'}
							>
								<Flex align={'center'} gap={'5px'}>
									<Icon as={CopyIcon} color='secondary' boxSize='12px' ml='8px' />

									<Tooltip
										label={item?.title?.length > 16 ? item?.title : ''}
										hasArrow
										bg='secondary'
										borderRadius='10px'
										fontWeight='500'
										fontSize='14px'
									>
										<Text
											sx={poppins_400_16_24}
											color='black'
											w='150px'
											overflow={'hidden'}
											textOverflow={'ellipsis'}
											whiteSpace='nowrap'
											textAlign='left'
										>
											{item.title}
										</Text>
									</Tooltip>
								</Flex>

								<Text sx={poppins_400_16_24} color={'textColor.gray'}>
									{item.percentage}%
								</Text>
							</Flex>
						</ListItem>
					);
				})}
			</UnorderedList>
		</Grid>
	);
};
