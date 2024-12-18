import CreateOrEditLanding from '@/components/CreateWebPages/CreateOrEditLanding/CreateOrEditLanding';
import WebPagesConstructorLayout from '@/components/Layouts/WebPagesConstructorLayout';
import Meta from '@/components/Meta/Meta';

const EditDownloadLandingPageReleases = () => {
	return (
		<>
			<Meta title='Edit landing page' />
			<WebPagesConstructorLayout webpagesTypeId={3}>
				<CreateOrEditLanding />
			</WebPagesConstructorLayout>
		</>
	);
};

export default EditDownloadLandingPageReleases;
