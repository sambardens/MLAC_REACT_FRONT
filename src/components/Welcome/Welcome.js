import { Box } from '@chakra-ui/react';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetSelectedBap, resetSelectedBapUpdated } from 'store/slice';

import FirstVisit from '../Modals/Welcome/FirstVisit';

const Welcome = () => {
	const user = useSelector(state => state.user.user);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(resetSelectedBap());
		dispatch(resetSelectedBapUpdated());
	}, [dispatch]);

	return (
		<Box
			position={'relative'}
			h='100%'
			bgImage='/assets/images/homepageEdited.jpg'
			bgSize='100% 100%'
			bgPos='center'
		>
			{user.isNew && <FirstVisit />}
		</Box>
	);
};

export default Welcome;
