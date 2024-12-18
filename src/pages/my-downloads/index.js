import { Downloads } from '@/components/Downloads/Downloads';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import DownloadsLayout from '@/components/Layouts/DownloadsLayout';

const MyDownloadsPage = () => {
	return (
		<>
			<GoogleAnalytics />
			<DownloadsLayout title='My music' description='User downloads'>
				<Downloads />
			</DownloadsLayout>
		</>
	);
};

export default MyDownloadsPage;
