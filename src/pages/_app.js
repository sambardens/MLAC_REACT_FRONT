import { useRouter } from 'next/router';

import { ChakraProvider } from '@chakra-ui/react';

import { SessionProvider } from 'next-auth/react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';
import 'react-multi-email/dist/style.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from 'store';

import RouteProtection from '@/components/RouteProtection';

import '@/styles/globals.css';
import theme from '@/styles/theme';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
	const router = useRouter();

	NProgress.configure({
		trickleSpeed: 600,
		showSpinner: false,
		easing: 'ease',
		speed: 600,
	});
	useEffect(() => {
		const handleRouteStart = () => NProgress.start();
		const handleRouteDone = () => NProgress.done();

		router.events.on('routeChangeStart', handleRouteStart);
		router.events.on('routeChangeComplete', handleRouteDone);
		router.events.on('routeChangeError', handleRouteDone);

		return () => {
			router.events.off('routeChangeStart', handleRouteStart);
			router.events.off('routeChangeComplete', handleRouteDone);
			router.events.off('routeChangeError', handleRouteDone);
		};
	}, [router]);

	const protectedRoutes = [
		'/bap/[bapId]/releases/[releaseId]',
		'/bap/[bapId]/releases',
		'/bap/[bapId]/releases/[releaseId]/create-shop',
		'/bap/[bapId]/releases/[releaseId]/create-download-landing',
		'/bap/[bapId]/releases/[releaseId]/create-streaming-landing',
		'/bap/[bapId]/releases/[releaseId]/create-sell-landing',
		'/bap/[bapId]/releases/[releaseId]/edit-download-landing',
		'/bap/[bapId]/releases/[releaseId]/edit-streaming-landing',
		'/bap/[bapId]/releases/[releaseId]/edit-sell-landing',
		'/bap/[bapId]/web-pages',
		'/bap/[bapId]/web-pages/create-shop',
		'/bap/[bapId]/web-pages/create-download-landing/[releaseId]',
		'/bap/[bapId]/web-pages/create-streaming-landing/[releaseId]',
		'/bap/[bapId]/web-pages/create-sell-landing/[releaseId]',
		'/bap/[bapId]/web-pages/edit-download-landing/[releaseId]',
		'/bap/[bapId]/web-pages/edit-streaming-landing/[releaseId]',
		'/bap/[bapId]/web-pages/edit-sell-landing/[releaseId]',
		'/bap/[bapId]/bap-info',
		'/bap/[bapId]/splits-contracts',
		'/bap/[bapId]/analytics',
		'/bap/[bapId]/dashboard',
		'/bap/[bapId]/income',
		'/bap/[bapId]/mailing-list',
		'/create-new-bap',
		'/my-splits-contracts',
		'/my-income',
		'/my-downloads',
		'/welcome',
	];

	return (
		<>
			{' '}
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<SessionProvider session={session}>
						<RouteProtection protectedRoutes={protectedRoutes}>
							<main>
								<ChakraProvider theme={theme}>
									<Component {...pageProps} />
								</ChakraProvider>
							</main>
						</RouteProtection>
					</SessionProvider>
				</PersistGate>
			</Provider>
		</>
	);
}
