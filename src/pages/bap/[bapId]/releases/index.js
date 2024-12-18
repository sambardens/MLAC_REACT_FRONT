import { useState } from 'react';

import MainLayout from '@/components/Layouts/MainLayout';
import Releases from '@/components/Releases/Release';

const ReleasesPage = () => {
	const [isStartPage, setIsStartPage] = useState(true);

	return (
		<MainLayout
			setIsStartPage={setIsStartPage}
			title='Releases'
			description='Discover the latest releases from Major Labl Artist Club. Stay up-to-date with the newest artworks, exhibitions, and creative projects by our talented artists.'
		>
			<Releases setIsStartPage={setIsStartPage} isStartPage={isStartPage} />
		</MainLayout>
	);
};
export default ReleasesPage;
