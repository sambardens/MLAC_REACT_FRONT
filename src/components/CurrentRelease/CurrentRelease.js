import { useRouter } from 'next/router';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRelease } from 'store/slice';

import CreateOrEditRelease from '@/components/Releases/CreateOrEditRelease/CreateOrEditRelease';

const CurrentRelease = () => {
	const { query } = useRouter();
	const { selectedBap } = useSelector(state => state.user);
	const dispatch = useDispatch();
	const releaseIdFromQuery = query?.releaseId && Number(query.releaseId);

	useEffect(() => {
		if (releaseIdFromQuery && selectedBap?.releases?.length > 0) {
			const release = selectedBap?.releases?.find(el => el.id === releaseIdFromQuery);
			if (release) {
				dispatch(setSelectedRelease({ ...release }));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [releaseIdFromQuery, selectedBap?.releases?.length, selectedBap?.bapId]);

	return <CreateOrEditRelease newRelease={false} />;
};

export default CurrentRelease;
