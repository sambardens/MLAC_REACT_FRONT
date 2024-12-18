import { Box, Flex } from '@chakra-ui/react';

import { useSelector } from 'react-redux';

const BannerFieldShop = () => {
	const shopUser = useSelector(state => state?.shopUser);

	const pos = Number(shopUser?.bannerPosition);

	return (
		shopUser?.bannerSrc && (
			<Flex
				pos='fixed'
				justifyContent={'center'}
				alignItems={'center'}
				w={pos === 4 ? '65vw' : '100vw'}
				h={pos === 1 ? '30vh' : pos === 3 ? '72vh' : '100vh'}
				bgColor='secondary'
				maxW='100vw'
				pointerEvents='none'
			>
				{shopUser?.bannerType === 'image' && (
					<Box
						bgImage={shopUser?.bannerSrc}
						alt='Shop banner'
						width='100%'
						height='100%'
						bgSize={'cover'}
						bgPos={'center'}
					/>
				)}

				{shopUser?.bannerType === 'video' && (
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
						<source src={shopUser?.bannerSrc} type='video/mp4' />
						<source src={shopUser?.bannerSrc} type='video/webm' />
						<source src={shopUser?.bannerSrc} type='video/x-msvideo' />
					</Box>
				)}
			</Flex>
		)
	);
};

export default BannerFieldShop;
