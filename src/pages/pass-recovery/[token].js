import NewPassSection from '@/components/Auth/NewPassSection/NewPassSection';
import AuthLayout from '@/components/Layouts/AuthLayout';

const NewPassPage = () => {
	return (
		<AuthLayout title='New password'>
			<NewPassSection />
		</AuthLayout>
	);
};

export default NewPassPage;
