import { Box } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetAudio } from 'store/audio/audio-slice';
import { resetSelectedRelease } from 'store/slice';

import WebPagesMenu from '../Releases/Menus/WebPagesMenu/WebPagesMenu';

const Web = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(resetAudio());
		dispatch(resetSelectedRelease());
	}, [dispatch]);

	return (
		<Box position={'relative'} h='100%'>
			<WebPagesMenu />
		</Box>
	);
};

export default Web;
