import MainLayout from '@/components/Layouts/MainLayout';
import MyContractsAndSplits from '@/components/MyContractsAndSplits/MyContractsAndSplits';

const ContractsPage = () => {
	return (
		<MainLayout title='My splits & contracts'>
			<MyContractsAndSplits />
		</MainLayout>
	);
};

export default ContractsPage;
