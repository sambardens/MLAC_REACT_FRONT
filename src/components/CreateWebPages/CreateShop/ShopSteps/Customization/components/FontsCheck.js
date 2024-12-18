import { Flex, ListItem, Text, Tooltip, UnorderedList } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getAccurateTooltipLabel from 'src/functions/utils/shop/getAccurateTooltipLabel';
import { setShop } from 'store/shop/shop-slice';

import { PopoverFonts } from '@/components/BapInfo/BrandKit/components/PopoverFonts';
import Cross from '@/components/VisualElements/Cross';

import { poppins_500_18_27 } from '@/styles/fontStyles';

export const FontsCheck = ({ mt, isCross = false, onCrossClick }) => {
	const shop = useSelector(state => state.shop);
	const [fontsList, setFontsList] = useState(shop?.selectedFonts || []);
	const [selectedFont, setSelectedFont] = useState({
		activeFontFamily: 'Open Sans',
	});
	const [fontSizeValue, setFontSizeValue] = useState({ value: 14, label: 14 });
	const dispatch = useDispatch();

	useEffect(() => {
		const updatedShop = { ...shop, selectedFonts: fontsList };
		dispatch(setShop(updatedShop));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fontsList]);

	return (
		<>
			<Flex justifyContent={'space-between'} alignItems={'center'} w='100%' mt={mt}>
				<Text color={'textColor.black'} sx={poppins_500_18_27}>
					Fonts
				</Text>

				{isCross && <Cross onCrossClick={onCrossClick} />}
			</Flex>

			<UnorderedList m={'0'} mt={'16px'} display={'flex'} flexDir={'column'} gap={'4px'} mb={'32px'}>
				{fontsList?.map((itemFont, index) => {
					const textStyle = {
						color: 'textColor.black',
						fontWeight: `${itemFont.weight}`,
						fontStyle: itemFont?.variant === 'italic' ? 'italic' : 'initial',
						fontSize: '16px',
						lineHeight: '24px',
						overflow: 'hidden',
						paddingTop: '5px',
					};

					return (
						<Tooltip
							hasArrow
							label={getAccurateTooltipLabel('font', index)}
							placement='right'
							bg='bg.black'
							color='textColor.white'
							fontSize='16px'
							borderRadius={'5px'}
							key={itemFont.id}
						>
							<ListItem
								key={itemFont.id}
								listStyleType={'none'}
								py={'14px'}
								w={'100%'}
								h={'50px'}
								p={'10.5px 10px'}
								borderRadius={'5px'}
								bg={'bg.light'}
							>
								<Flex alignItems={'center'} justifyContent={'space-between'}>
									<Text
										sx={textStyle}
										maxWidth={'150px'}
										overflow={'hidden'}
										textOverflow={'ellipsis'}
										whiteSpace='nowrap'
									>
										{itemFont.title}
									</Text>
									<Flex alignItems={'center'}>
										<Tooltip
											hasArrow
											label={itemFont?.font?.length > 14 && itemFont?.font}
											placement='top'
											bg='bg.black'
											color='textColor.white'
											fontSize='16px'
											borderRadius={'5px'}
										>
											<Text
												sx={textStyle}
												maxWidth={'150px'}
												overflow={'hidden'}
												textOverflow={'ellipsis'}
												whiteSpace='nowrap'
											>
												{itemFont.font}
											</Text>
										</Tooltip>
										<Text sx={textStyle} ml={'5px'} pr={'10px'}>
											{itemFont.size}
										</Text>
										<PopoverFonts
											selectedFont={selectedFont}
											setSelectedFont={setSelectedFont}
											fontSizeValue={fontSizeValue}
											setFontSizeValue={setFontSizeValue}
											setBrandKitFonts={setFontsList}
											weight={itemFont?.weight}
											variant={itemFont?.variant}
											id={itemFont.id}
											font={itemFont?.font}
											size={itemFont?.size}
										/>
									</Flex>
								</Flex>
							</ListItem>
						</Tooltip>
					);
				})}
			</UnorderedList>
		</>
	);
};
