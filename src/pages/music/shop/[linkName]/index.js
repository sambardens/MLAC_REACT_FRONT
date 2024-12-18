import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import getShop from 'src/functions/serverRequests/shop/getShop';

import FacebookPixel from '@/components/FacebookPixel/FacebookPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import Meta from '@/components/Meta/Meta';
import Shop from '@/components/WebPages/ShopPage/Shop';

const UserShopPage = ({ resData }) => {
	const paypalOptions = {
		'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
		currency: 'GBP',
		intent: 'capture',
	};
	return (
		<>
			{/* <Script
				strategy='afterInteractive'
				src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
			/> */}
			<Meta
				title={resData?.shop?.metaTitle || resData?.shop?.linkName}
				description={resData?.shop?.metaDescription}
				favicon={resData?.shop?.faviconSrc}
			/>
			{resData.shop?.facebookPixel && <FacebookPixel fbPixel={resData.shop?.facebookPixel} />}
			<GoogleAnalytics />
			<PayPalScriptProvider options={paypalOptions}>
				<Shop resData={resData} />
			</PayPalScriptProvider>
		</>
	);
};

// export async function getStaticPaths() {
// 	const res = await getAllShopsLinkName();
// 	const paths = res?.shops?.map(shop => ({
// 		params: { linkName: shop.linkName, bapName: shop.bapName },
// 	}));
// 	return { paths, fallback: false };
// }

// export async function getStaticProps(context) {
// 	const linkName = context.params?.linkName;
// 	const resData = await getShop(linkName);

// 	if (resData?.success) {
// 		return {
// 			props: {
// 				resData,
// 			},
// 			revalidate: 15,
// 		};
// 	} else {
// 		return {
// 			notFound: true,
// 		};
// 	}
// }

export async function getServerSideProps(context) {
	const { linkName } = context.query;
	const resData = await getShop(linkName);

	if (resData?.success) {
		return {
			props: {
				resData,
			},
		};
	} else {
		return {
			notFound: true,
		};
	}
}

export default UserShopPage;
