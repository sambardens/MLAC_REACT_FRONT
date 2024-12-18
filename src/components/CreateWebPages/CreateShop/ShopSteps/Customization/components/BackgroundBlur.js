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

import debounce from 'lodash.debounce';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBlur } from 'store/shop/shop-slice';

import SliderBtnIcon from '@/assets/icons/base/slider-btn.svg';

const BackgroundBlur = ({ src, mt = '32px' }) => {
	const dispatch = useDispatch();
	const shop = useSelector(state => state.shop);
	const blur = useSelector(state => state?.shop?.blur);
	const [bgBlur, setBgBlur] = useState(blur);

	const setPreviewBgBlur = useRef(
		debounce(value => {
			dispatch(setBlur(value));
		}, 200),
	).current;

	const handleBlurChange = value => {
		setBgBlur(value);

		setPreviewBgBlur(value);
	};

	return (
		<Box mt={mt}>
			<Heading as='h3' fontSize='18px' fontWeight='500' lineHeight='1.5' mb='16px'>
				Background blur
			</Heading>
			<Text mt='4px' fontSize='14px' fontWeight='400' color={'secondary'}>
				Choose a background blur
			</Text>
			<Flex mt='16px'>
				<Box bg='bg.secondary' minW='64px' w='64px' h='64px' borderRadius='10px' overflow='hidden'>
					<Box
						w='100%'
						h='100%'
						bgImage={`url(${src})`}
						bgColor='bg.secondary'
						bgPosition='center'
						bgSize={'100% 100%'}
						filter={`blur(${(0.64 * blur) / 20}px)`}
					/>
				</Box>

				<Box py='12px' ml='12px' w='100%'>
					<Flex justify='space-between'>
						<Text fontSize='16px' fontWeight='400' color='black'>
							Background image blur
						</Text>
						<Text fontSize='16px' fontWeight='400' color='black'>
							{bgBlur}%
						</Text>
					</Flex>
					<Slider aria-label='slider-ex-2' defaultValue={bgBlur} onChange={handleBlurChange} w='100%'>
						<SliderTrack bg='bg.secondary'>
							<SliderFilledTrack bg='accent' />
						</SliderTrack>
						<SliderThumb>
							<Icon as={SliderBtnIcon} boxSize='16px' />
						</SliderThumb>
					</Slider>
				</Box>
			</Flex>
		</Box>
	);
};

export default BackgroundBlur;
