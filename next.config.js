/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	i18n: {
		locales: ['en-US', 'ua'],
		defaultLocale: 'en-US',
	},
	devIndicators: {
		buildActivity: false,
	},
	// headers: async () => {
	// 	return [
	// 		{
	// 			source: '/',
	// 			headers: [
	// 				{
	// 					key: 'frame-src',
	// 					value: 'https://www.canva.com',
	// 				},
	// 			],
	// 		},
	// 	];
	// },
	images: {
		unoptimized: true,
		formats: ['image/webp'],
		domains: [
			'i.scdn.co',
			'api-major-labl.pixy.pro',
			'api.majorlabl.com',
			'export-download.canva.com',
			'mosaic.scdn.co',
			'lh3.googleusercontent.com',
			'lh3.googleusercontent.com/a',
			'platform-lookaside.fbsbx.com',
			'e-cdns-images.dzcdn.net',
			'is1-ssl.mzstatic',
			's3.amazonaws.com',
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		});
		// config.module.rules.push({
		// 	test: /\.(png|jpg|gif|pdf|jpeg)$/,
		// 	use: ['file-loader?name=[path][name].[ext]'],
		// });

		return config;
	},
};

module.exports = nextConfig;
