import dynamic from 'next/dynamic';

import {
	Box,
	Flex,
	IconButton,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';

import CustomSelect from '@/components/CustomInputs/CustomSelect';

import ArrowDownIcon from '@/assets/icons/all/arrowDown.svg';
import BoldFontIcon from '@/assets/icons/all/bold-font.svg';
import ItalicFontIcon from '@/assets/icons/all/italic-font.svg';
import PlusIcon from '@/assets/icons/all/plus.svg';
import EditIcon from '@/assets/icons/modal/edit.svg';

export const PopoverFonts = ({
	selectedFont,
	setSelectedFont,
	fontSizeValue,
	setFontSizeValue,
	setBrandKitFonts,
	weight = '',
	variant = '',
	id = '',
	font,
	size,
}) => {
	const [isArrowRotated, setIsArrowRotated] = useState(false);
	const [fontVariants, setFontVariants] = useState({
		bold: false,
		italic: false,
	});

	const [FontPicker, setFontPicker] = useState(null);

	useEffect(() => {
		if (weight && weight !== '400' && weight !== 400) {
			setFontVariants(prev => ({ ...prev, bold: true }));
		}
		if (variant === 'italic') {
			setFontVariants(prev => ({ ...prev, italic: true }));
		}
	}, [weight, variant]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setFontPicker(
				dynamic(() => import('font-picker-react'), {
					ssr: true,
				}),
			);
		}
	}, [setFontPicker]);

	const handleBoxClick = () => setIsArrowRotated(!isArrowRotated);

	const createFontOptions = () => {
		let myArray = [];
		for (let i = 0; i < 50; i++) {
			myArray.push({ label: i + 1, value: i + 1 });
		}
		return myArray;
	};

	const variants = ['italic', '600', '600italic', 'regular'];

	const handleFontChange = nextFont => {
		// const { files } = nextFont;
		// const isBold = fontVariants.bold || (fontVariants.bold && fontVariants.italic);
		// const fontWeight = isBold ? '600' : '400';
		// const variant = fontVariants.italic ? 'italic' : '';

		// let fontLink;
		// if (fontVariants.bold) {
		// 	fontLink = files?.['600'];
		// } else if (fontVariants.italic) {
		// 	fontLink = files?.italic;
		// } else if (fontVariants.bold && fontVariants.italic) {
		// 	fontLink = files?.['600italic'];
		// } else {
		// 	fontLink = files?.['400'] ?? files?.['500'];
		// }

		setSelectedFont({
			activeFontFamily: nextFont.family,
			// fontWeight,
			// fontLink,
			// variant,
		});
	};

	const iconButtonStyle = {
		width: '24px',
		height: '40px',
		bg: 'bg.light',
		border: '1px',
		borderColor: 'stroke',
	};

	const handleEdit = () => {
		font && setSelectedFont({ activeFontFamily: font });
		size && setFontSizeValue({ value: size, label: size });
		setFontVariants({
			italic: Boolean(variant),
			bold: Boolean(weight !== '400' && weight !== 400),
		});
	};
	return (
		<Popover
			isLazy={true}
			onClose={() => {
				const isBold = fontVariants.bold || (fontVariants.bold && fontVariants.italic);
				const fontWeight = isBold ? '600' : '400';
				const variant = fontVariants.italic ? 'italic' : '';
				if (id) {
					setBrandKitFonts(prev => {
						const newArray = prev.map((obj, index) => {
							if (obj.id === id) {
								const title = index === 0 ? 'Header' : index === 1 ? 'Subtitle' : 'Buttons';
								return {
									font: selectedFont?.activeFontFamily,
									id: crypto.randomUUID(),
									size: fontSizeValue?.value,
									weight: fontWeight,
									title,
									italic: variant,
									// fontLink: selectedFont?.fontLink,
								};
							}
							return obj;
						});

						return newArray;
					});
				} else {
					setBrandKitFonts(prev => [
						...prev,
						{
							font: selectedFont?.activeFontFamily,
							id: crypto.randomUUID(),
							size: fontSizeValue.value,
							weight: fontWeight,
							title: selectedFont?.activeFontFamily,
							italic: variant,
							// fontLink: selectedFont.fontLink,
						},
					]);
				}
			}}
		>
			<PopoverTrigger>
				<Box cursor={'pointer'} onClick={handleEdit}>
					{id ? <EditIcon /> : <PlusIcon />}
				</Box>
			</PopoverTrigger>
			<PopoverContent
				py={'11px'}
				px={'10px'}
				borderRadius={'5px'}
				boxShadow={'0px 4px 7px 5px rgba(136, 136, 136, 0.1)'}
				border={'none'}
				w={'376px'}
				left={'-110px'}
			>
				{/* <PopoverCloseButton /> */}
				<PopoverBody p={0} w={'100%'}>
					<Text
						color='black'
						fontWeight={fontVariants?.bold ? '600' : '400'}
						fontSize={`${fontSizeValue.value}px`}
						fontStyle={fontVariants?.italic ? 'italic' : 'initial'}
						lineHeight={'21px'}
						mb={'21px'}
						// {...(fontSizeValue.value > 40 && { marginTop: '10px' })}
						mt={'10px'}
						className='apply-font'
					>
						Edit text style
					</Text>

					<Flex
						w={'271px'}
						h={'44px'}
						position={'relative'}
						alignItems={'center'}
						justifyContent={'space-between'}
					>
						<Flex
							alignItems={'center'}
							justifyContent={'space-between'}
							w={'100%'}
							onClick={handleBoxClick}
						>
							{FontPicker && (
								<FontPicker
									apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY}
									activeFontFamily={selectedFont?.activeFontFamily}
									variants={variants}
									onChange={nextFont => {
										handleFontChange(nextFont);
									}}
									limit={200}
								/>
							)}
						</Flex>

						<Box
							position={'absolute'}
							top={'10px'}
							right={'10px'}
							transform={isArrowRotated ? 'rotate(180deg)' : 'none'}
							transition={'transform 0.3s ease'}
						>
							<ArrowDownIcon />
						</Box>

						<CustomSelect
							name='fonts'
							onChange={e => {
								setFontSizeValue(e);
							}}
							value={fontSizeValue.value}
							options={createFontOptions()}
							ml={'5px'}
							w={'80px'}
							h={'44px'}
							pxDropdownIcon={'8px'}
							borderRadiusControl={'5px'}
							hControl={'44px'}
							plValueContainer={'8px'}
							placeholder={''}
							minHeight={'44px'}
						/>
					</Flex>

					<Flex alignItems={'center'} gap={'5px'} mt={'20px'}>
						<IconButton
							sx={fontVariants.bold && iconButtonStyle}
							aria-label='bold'
							icon={<BoldFontIcon />}
							onClick={() => {
								setFontVariants(prev => ({
									...prev,
									bold: !fontVariants.bold,
								}));
							}}
						/>
						<IconButton
							sx={fontVariants.italic && iconButtonStyle}
							aria-label='italic'
							icon={<ItalicFontIcon />}
							onClick={() => {
								setFontVariants(prev => ({
									...prev,
									italic: !fontVariants.italic,
								}));
							}}
						/>
					</Flex>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
