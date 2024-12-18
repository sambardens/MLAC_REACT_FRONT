import { Box, Flex, Heading } from '@chakra-ui/react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHomepageBannerType } from 'store/shop/shop-slice';

import CustomButton from '@/components/Buttons/CustomButton';

import UploadImageContainer from '../../../../components/UploadImageContainer/UploadImageContainer';

import UploadVideoContainer from './UploadVideoContainerShop';
import ChooseBannerPosition from './bannerPosition/ChooseBannerPosition';

const BannerSettingShop = ({ bannerSrc, setBannerSrc, setBannerFile }) => {
	const dispatch = useDispatch();
	const shop = useSelector(state => state.shop);
	const [bannerType, setBannerType] = useState(shop?.bannerType);

	const handleBannerCrossClick = () => {
		setBannerSrc(null);
		setBannerFile(null);
	};

	const handleSetImageSrc = src => {
		dispatch(setHomepageBannerType('image'));
		setBannerSrc(src);
	};

	const handleSetVideoSrc = src => {
		dispatch(setHomepageBannerType('video'));
		setBannerSrc(src);
	};

	const imgType = (shop?.bannerPosition && Number(shop.bannerPosition)) || null;
	const canvaSize = {
		1: { imgH: 692, imgW: 2304 },
		2: { imgH: 1080, imgW: 1920 },
		3: { imgH: 1080, imgW: 2340 },
		4: { imgH: 1500, imgW: 1500 },
	};
	const imgH = imgType ? canvaSize[imgType].imgH : 1500;
	const imgW = imgType ? canvaSize[imgType].imgW : 1500;
	return (
		<Box mt='32px'>
			<Heading fontWeight={'500'} fontSize={'18px'} color='black' mb='16px'>
				Choose banner type
			</Heading>

			<Flex gap='8px'>
				<CustomButton
					onClickHandler={() => {
						setBannerType('image');
					}}
					w='50%'
					styles={`${bannerType === 'image' ? 'blueYonder' : 'transparent-bold'}`}
				>
					Image
				</CustomButton>

				<CustomButton
					onClickHandler={() => {
						setBannerType('video');
					}}
					w='50%'
					styles={`${bannerType === 'video' ? 'blueYonder' : 'transparent-bold'}`}
				>
					Video
				</CustomButton>
			</Flex>

			{bannerType === 'image' && (
				<UploadImageContainer
					title='Banner image'
					text='Upload your own banner or create a new one with Canva'
					setImageSrc={handleSetImageSrc}
					setImageFile={setBannerFile}
					mt='24px'
					faviconSrc={shop.bannerType === 'image' && bannerSrc}
					isFavicon={bannerSrc && shop.bannerType === 'image'}
					isCross={bannerSrc}
					handleCrossClick={handleBannerCrossClick}
					imgW={imgW}
					imgH={imgH}
				/>
			)}
			{bannerType === 'video' && (
				<UploadVideoContainer
					title='Video'
					text='Upload your video banner'
					setVideoSrc={handleSetVideoSrc}
					setVideoFile={setBannerFile}
					mt='24px'
					isCross={bannerSrc}
					handleCrossClick={handleBannerCrossClick}
				/>
			)}

			<ChooseBannerPosition />
		</Box>
	);
};

export default BannerSettingShop;
