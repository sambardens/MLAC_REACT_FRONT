import {
	Box,
	Flex,
	Heading,
	Icon,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Text,
} from '@chakra-ui/react';

import SliderBtnIcon from '@/assets/icons/base/slider-btn.svg';

const BackgroundBlur = ({ blur, setBlur, src, mt = '32px' }) => {
	const blurPx = Number(blur) / 30;
	return (
		<Box mt={mt}>
			<Heading as='h3' fontSize='18px' fontWeight='500' lineHeight='1.5' mb='16px'>
				Background
			</Heading>
			<Flex>
				<Box bg='bg.secondary' minW='64px' w='64px' h='64px' borderRadius='10px' overflow='hidden'>
					{src && (
						<Box
							w='100%'
							h='100%'
							bgImage={`url(${src})`}
							bgPosition='center'
							bgSize={'100% 100%'}
							filter={`blur(${blurPx}px)`}
						/>
					)}
				</Box>

				<Box py='12px' ml='12px' w='100%'>
					<Flex justify='space-between'>
						<Text fontSize='16px' fontWeight='400' color='black'>
							Background image blur
						</Text>
						<Text fontSize='16px' fontWeight='400' color='black'>
							{blur}%
						</Text>
					</Flex>
					<Slider
						aria-label='slider-ex-2'
						defaultValue={blur}
						onChange={value => setBlur(value)}
						w='100%'
					>
						<SliderTrack bg='bg.secondary'>
							<SliderFilledTrack bg='accent' />
						</SliderTrack>
						<SliderThumb zIndex={0}>
							<Icon as={SliderBtnIcon} boxSize='16px' />
						</SliderThumb>
					</Slider>
				</Box>
			</Flex>
		</Box>
	);
};

export default BackgroundBlur;
