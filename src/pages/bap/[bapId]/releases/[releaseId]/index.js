import { useSelector } from 'react-redux';

import CurrentRelease from '@/components/CurrentRelease/CurrentRelease';
import MainLayout from '@/components/Layouts/MainLayout';

const CurrentReleasePage = () => {
	const { selectedRelease } = useSelector(state => state.user);

	return (
		<MainLayout title={selectedRelease?.name ? `Release ${selectedRelease?.name}` : 'Release'}>
			<CurrentRelease />
		</MainLayout>
	);
};

export default CurrentReleasePage;
