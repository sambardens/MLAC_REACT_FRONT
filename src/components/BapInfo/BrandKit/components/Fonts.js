import { Box, Flex, ListItem, Text, Tooltip, UnorderedList } from '@chakra-ui/react';

import { useEffect, useRef, useState } from 'react';

import TrashIcon from '@/assets/icons/all/trash_2.svg';

import { HeadingComponent } from './HeadingComponent';
import { PopoverFonts } from './PopoverFonts';
import { TextWithArrow } from './TextWithArrow';
import FontCardSkeleton from './sekeletons/FontCardSkeleton';
import { poppins_400_14_21 } from '@/styles/fontStyles';

const Font = ({
	itemFont,

	i,
	isCanEdit,
	selectedFont,
	setSelectedFont,
	setBrandKitFonts,
	fontSizeValue,
	setFontSizeValue,
	listWidth,
}) => {
	const getFontTitle = (i, itemFont) => {
		const fontConditions = {
			0: 'H1',
			1: 'H2',
			default: 'Buttons',
		};
		const title = fontConditions[i] || fontConditions.default;
		const { font = '', size = '' } = itemFont || {};
		const fontTitleString = `${title}, ${font} ${size}`;
		return fontTitleString;
	};

	const handleDeleteFont = id => {
		setBrandKitFonts(prev =>
			prev?.filter(item => {
				return item?.id !== id;
			}),
		);
	};

	const textRef = useRef(null);
	const containerRef = useRef(null);

	const [isTextOverflowed, setTextOverflowed] = useState(false);

	useEffect(() => {
		const textElement = textRef.current;
		const containerElement = containerRef.current;
		if (textElement && containerElement) {
			if (textElement.scrollWidth > containerElement.clientWidth - 64) {
				setTextOverflowed(true);
			} else {
				setTextOverflowed(false);
			}
		}
	}, []);
	return (
		<ListItem listStyleType={'none'} py={'14px'}>
			<Flex alignItems={'center'} justifyContent={'space-between'} ref={containerRef}>
				<Tooltip
					hasArrow
					label={isTextOverflowed && getFontTitle(i, itemFont)}
					placement='auto'
					bg='bg.black'
					color='textColor.white'
					fontSize='16px'
					borderRadius={'5px'}
				>
					<Text
						ref={textRef}
						maxW={`${listWidth - 84}px`}
						color={'textColor.black'}
						fontWeight={`${itemFont.weight}`}
						fontStyle={itemFont?.italic === 'italic' ? 'italic' : 'initial'}
						fontSize={'16px'}
						lineHeight={'24px'}
						overflow={'hidden'}
						textOverflow={'ellipsis'}
						whiteSpace='nowrap'
					>
						{getFontTitle(i, itemFont)}
					</Text>
				</Tooltip>
				{isCanEdit && (
					<Flex alignItems={'center'} ml='8px'>
						<PopoverFonts
							selectedFont={selectedFont}
							setSelectedFont={setSelectedFont}
							fontSizeValue={fontSizeValue}
							setFontSizeValue={setFontSizeValue}
							setBrandKitFonts={setBrandKitFonts}
							weight={itemFont?.weight}
							variant={itemFont?.italic}
							id={itemFont?.id}
							font={itemFont?.font}
							size={itemFont?.size}
						/>
						<Box
							ml={'10px'}
							cursor={'pointer'}
							onClick={() => {
								handleDeleteFont(itemFont?.id);
							}}
						>
							<TrashIcon />
						</Box>
					</Flex>
				)}
			</Flex>
		</ListItem>
	);
};

export const Fonts = ({
	selectedFont,
	setSelectedFont,
	brandKitFonts,
	setBrandKitFonts,
	fontSizeValue,
	setFontSizeValue,
	isLoadingData,
	isCanEdit,
}) => {
	const [listWidth, setListWidth] = useState(0);
	const handleClick = () => {
		console.log('click');
	};

	const listRef = useRef(null);

	useEffect(() => {
		const listElement = listRef.current;
		setListWidth(listElement.clientWidth);
	}, []);
	return (
		<Flex flexDir={'column'} ref={listRef} maxW={listWidth || 'auto'}>
			{isCanEdit && (
				<HeadingComponent
					title={'Fonts'}
					handleClick={handleClick}
					selectedFont={selectedFont}
					setSelectedFont={setSelectedFont}
					fontSizeValue={fontSizeValue}
					setFontSizeValue={setFontSizeValue}
					setBrandKitFonts={setBrandKitFonts}
					brandKitFonts={brandKitFonts}
				/>
			)}

			{isCanEdit && (!brandKitFonts || brandKitFonts?.length === 0) && !isLoadingData && (
				<TextWithArrow text={'Click the plus sign to add new fonts'} />
			)}

			{!isCanEdit && (
				<Text color={'textColor.gray'} sx={poppins_400_14_21} w={'100%'} pb='4px'>
					B.A.P owner or admin can add brand kit palette.
				</Text>
			)}

			{isLoadingData && <FontCardSkeleton />}

			{listWidth && (
				<UnorderedList m={'0'} mt={'8px'} p={'10px'}>
					{brandKitFonts?.map((itemFont, i) => (
						<Font
							key={itemFont.id}
							itemFont={itemFont}
							i={i}
							isCanEdit={isCanEdit}
							selectedFont={selectedFont}
							setSelectedFont={setSelectedFont}
							fontSizeValue={fontSizeValue}
							setFontSizeValue={setFontSizeValue}
							setBrandKitFonts={setBrandKitFonts}
							listWidth={listWidth}
						/>
					))}
				</UnorderedList>
			)}
		</Flex>
	);
};
