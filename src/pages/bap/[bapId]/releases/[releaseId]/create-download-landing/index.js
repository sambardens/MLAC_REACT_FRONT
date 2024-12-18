import CreateOrEditLanding from '@/components/CreateWebPages/CreateOrEditLanding/CreateOrEditLanding';
import WebPagesConstructorLayout from '@/components/Layouts/WebPagesConstructorLayout';
import Meta from '@/components/Meta/Meta';

const CreateDownloadLandingPageReleases = () => {
	return (
		<>
			<Meta title='Create landing page' />
			<WebPagesConstructorLayout webpagesTypeId={1}>
				<CreateOrEditLanding />
			</WebPagesConstructorLayout>
		</>
	);
};

export default CreateDownloadLandingPageReleases;
