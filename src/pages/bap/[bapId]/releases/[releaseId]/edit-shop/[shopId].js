import CreateShop from '@/components/CreateWebPages/CreateShop/CreateShop';
import WebPagesConstructorLayout from '@/components/Layouts/WebPagesConstructorLayout';
import Meta from '@/components/Meta/Meta';

const EditShopPage = () => {
	return (
		<>
			<Meta title='Edit shop' />
			<WebPagesConstructorLayout>
				<CreateShop isNew={false} />
			</WebPagesConstructorLayout>
		</>
	);
};

export default EditShopPage;
