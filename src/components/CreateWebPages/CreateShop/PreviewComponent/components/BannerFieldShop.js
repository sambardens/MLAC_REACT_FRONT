import { Box, Flex } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const BannerFieldShop = ({ bannerSrc }) => {
	const shop = useSelector(state => state?.shop);
	const [bannerWidth, setBannerWidth] = useState('100%');
	const [bannerHeight, setBannerHeight] = useState('30%');

	const [isVideo, setIsVideo] = useState(shop?.bannerType === 'video');

	useEffect(() => {
		setIsVideo(false);
		setTimeout(() => {
			setIsVideo(true);
		}, 0);
	}, [bannerSrc]);

	useEffect(() => {
		if (Number(shop?.bannerPosition) === 1) {
			setBannerWidth('100%');
			setBannerHeight('30%');
		}
		if (Number(shop?.bannerPosition) === 2) {
			setBannerWidth('100%');
			setBannerHeight('100%');
		}
		if (Number(shop?.bannerPosition) === 3) {
			setBannerWidth('100%');
			setBannerHeight('72%');
		}
		if (Number(shop?.bannerPosition) === 4) {
			setBannerWidth('65%');
			setBannerHeight('100%');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shop?.bannerPosition]);

	return (
		<Flex
			pos='relative'
			justifyContent={'center'}
			alignItems={'center'}
			w={bannerWidth}
			h={bannerHeight}
			bgColor='secondary'
			mx='auto'
		>
			{shop?.bannerType === 'image' && (
				<Box
					bgImage={bannerSrc}
					alt='Shop banner'
					width='100%'
					height='100%'
					bgSize={'cover'}
					bgPos={'center'}
				/>
			)}

			{shop?.bannerType === 'video' && isVideo && (
				<Box
					as='video'
					sx={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
					preload='auto'
					autoPlay='autoplay'
					loop='loop'
					// poster=''
					muted
				>
					<source src={bannerSrc} type='video/mp4' />
					<source src={bannerSrc} type='video/webm' />
					<source src={bannerSrc} type='video/x-msvideo' />
				</Box>
			)}
		</Flex>
	);
};

export default BannerFieldShop;
