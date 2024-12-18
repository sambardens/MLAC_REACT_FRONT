import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import getShop from 'src/functions/serverRequests/shop/getShop';

import FacebookPixel from '@/components/FacebookPixel/FacebookPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import Meta from '@/components/Meta/Meta';
import ShopWithSelectedRelease from '@/components/WebPages/ShopPage/ShopWithSelectedRelease';

// const fbPixelMock = `<script>
//   !function(f,b,e,v,n,t,s)
//   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//   n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//   n.queue=[];t=b.createElement(e);t.async=!0;
//   t.src=v;s=b.getElementsByTagName(e)[0];
//   s.parentNode.insertBefore(t,s)}(window, document,'script',
//   'https://connect.facebook.net/en_US/fbevents.js');
//   fbq('init', '1988168488208096');
//   fbq('track', 'PageView');
// </script>
// <noscript><img height="1" width="1" style="display:none"
//   src="https://www.facebook.com/tr?id=1988168488208096&ev=PageView&noscript=1"
// /></noscript>`;

const UserReleasePage = ({ resData }) => {
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
			<GoogleAnalytics />
			{resData.shop?.fbPixel && <FacebookPixel fbPixel={resData.shop?.fbPixel} />}
			<PayPalScriptProvider options={paypalOptions}>
				<ShopWithSelectedRelease resData={resData} />
			</PayPalScriptProvider>
		</>
	);
};

export default UserReleasePage;

// export async function getStaticPaths() {
// 	const res = await getAllShopsLinkName();
// 	const paths = res?.shops?.map(shop => ({
// 		params: { linkName: shop.linkName, bapName: shop.bapName },
// 	}));
// 	return { paths, fallback: false };
// }

// export async function getStaticProps(context) {
// 	const linkName = context.params.linkName;
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
