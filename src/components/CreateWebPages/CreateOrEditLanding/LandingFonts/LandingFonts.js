import { Flex, ListItem, Text, Tooltip, UnorderedList } from '@chakra-ui/react';

import { useState } from 'react';

import { PopoverFonts } from '@/components/BapInfo/BrandKit/components/PopoverFonts';

import { poppins_500_18_27 } from '@/styles/fontStyles';

const LandingFonts = ({ mt, fonts, setFonts }) => {
	const [selectedFont, setSelectedFont] = useState({ activeFontFamily: 'Poppins' });
	const [fontSizeValue, setFontSizeValue] = useState({ value: 16, label: 16 });

	return (
		<>
			<Flex justifyContent={'space-between'} alignItems={'center'} w='100%' mt={mt}>
				<Text sx={poppins_500_18_27}>Fonts</Text>
			</Flex>

			<UnorderedList m={'0'} mt={'16px'} display={'flex'} flexDir={'column'} gap={'4px'}>
				{fonts?.map(itemFont => {
					const textStyle = {
						color: 'color',
						fontWeight: `${itemFont.weight}`,
						fontStyle: itemFont?.italic === 'italic' ? 'italic' : 'initial',
						fontSize: '16px',
						lineHeight: 1.5,
						overflow: 'hidden',
						paddingTop: '5px',
					};

					return (
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
								<Tooltip
									hasArrow
									label={itemFont?.title?.length > 14 && itemFont?.title}
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
										{itemFont.title}
									</Text>
								</Tooltip>
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
										setBrandKitFonts={setFonts}
										weight={itemFont?.weight}
										variant={itemFont?.variant}
										id={itemFont?.id}
										font={itemFont?.font}
										size={itemFont?.size}
									/>
								</Flex>
							</Flex>
						</ListItem>
					);
				})}
			</UnorderedList>
		</>
	);
};

export default LandingFonts;
