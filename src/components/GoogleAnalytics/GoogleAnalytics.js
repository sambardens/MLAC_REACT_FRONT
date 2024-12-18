import Script from 'next/script';

const GoogleAnalytics = () => {
	const measurementId = process.env.NEXT_PUBLIC_MEASUREMENT_ID;
	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
				strategy='afterInteractive'
			/>
			<Script id='google-analytics' strategy='afterInteractive'>
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
			</Script>
		</>
	);
};

export default GoogleAnalytics;
