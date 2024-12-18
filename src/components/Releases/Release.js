import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAudio } from 'store/audio/audio-slice';
import { setDefaultReleaseModalMenuScreen, setReleaseScreen } from 'store/slice';

import CreateOrEditRelease from './CreateOrEditRelease/CreateOrEditRelease';
import ReleasesList from './ReleasesList/ReleasesList';

const Releases = ({ isStartPage, setIsStartPage }) => {
	const dispatch = useDispatch();
	const selectedBap = useSelector(state => state.user.selectedBap);

	useEffect(() => {
		dispatch(resetAudio());
		dispatch(setDefaultReleaseModalMenuScreen());
		setIsStartPage && setIsStartPage(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, selectedBap?.bapId]);

	const handleNewRelease = () => {
		setIsStartPage(false);
		dispatch(setReleaseScreen('main'));
	};

	return (
		<>
			{isStartPage ? (
				<ReleasesList handleNewRelease={handleNewRelease} />
			) : (
				<CreateOrEditRelease setIsStartPage={setIsStartPage} newRelease={true} />
			)}
		</>
	);
};
export default Releases;
