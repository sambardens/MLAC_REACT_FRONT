import MainLayout from '@/components/Layouts/MainLayout';
import Welcome from '@/components/Welcome/Welcome';

const WelcomePage = () => {
	return (
		<MainLayout title='Welcome'>
			<Welcome />
		</MainLayout>
	);
};

export default WelcomePage;
