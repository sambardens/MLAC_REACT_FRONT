import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import getLandingPageByLinkNameWithoutThunk from 'src/functions/serverRequests/landing/getLandingPageByLinkNameWithoutThunk';

import FacebookPixel from '@/components/FacebookPixel/FacebookPixel';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import Meta from '@/components/Meta/Meta';
import LandingPage from '@/components/WebPages/LandingPage/LangingPage';

const UserLandingPage = ({ landingInfo }) => {
	const { metaDescription, metaTitle, favicon, facebookPixel } = landingInfo;
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
			<Meta title={metaTitle} description={metaDescription} favicon={favicon} />
			<GoogleAnalytics />
			{facebookPixel && <FacebookPixel fbPixel={facebookPixel} />}
			{landingInfo.webpagesTypeId === 3 ? (
				<LandingPage landingInfo={landingInfo} />
			) : (
				<PayPalScriptProvider options={paypalOptions}>
					<LandingPage landingInfo={landingInfo} />
				</PayPalScriptProvider>
			)}
		</>
	);
};

// export async function getStaticPaths() {
// 	const res = await getAllLandingPages();
// 	const paths = res?.landings?.map(linkName => ({ params: { linkName } }));
// 	return { paths, fallback: false };
// }

// export async function getStaticProps(context) {
// 	const linkName = context.params.linkName;

// 	const res = await getLandingPageByLinkNameWithoutThunk(linkName);

// 	if (res?.success) {
// 		return {
// 			props: {
// 				landingInfo: res?.landingInfo,
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
	const linkName = context.query.linkName;

	const res = await getLandingPageByLinkNameWithoutThunk(linkName);
	console.log('res: ', res);

	if (res?.success) {
		return {
			props: {
				landingInfo: res?.landingInfo,
			},
		};
	} else {
		return {
			notFound: true,
		};
	}
}

export default UserLandingPage;
