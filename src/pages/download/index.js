import DownloadMusic from '@/components/DownloadMusic/DownloadMusic';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import AuthLayout from '@/components/Layouts/AuthLayout';

const DownloadMusicPage = () => {
	return (
		<>
			<GoogleAnalytics />
			<AuthLayout title='Download Music'>
				<DownloadMusic />
			</AuthLayout>
		</>
	);
};

export default DownloadMusicPage;
