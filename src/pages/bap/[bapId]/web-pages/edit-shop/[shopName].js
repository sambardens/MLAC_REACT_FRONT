import CreateShop from '@/components/CreateWebPages/CreateShop/CreateShop';
import WebPagesConstructorLayout from '@/components/Layouts/WebPagesConstructorLayout';
import Meta from '@/components/Meta/Meta';

const ShopPage = () => {
	return (
		<>
			<Meta title='Edit shop' />
			<WebPagesConstructorLayout>
				<CreateShop />
			</WebPagesConstructorLayout>
		</>
	);
};

export default ShopPage;
