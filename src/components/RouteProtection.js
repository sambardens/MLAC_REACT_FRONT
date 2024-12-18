import { useRouter } from 'next/router';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from 'store/auth';

import FullPageLoader from './Loaders/FullPageLoader';

export default function RouteProtection({ protectedRoutes, children }) {
	const userToken = useSelector(authSelectors.getUserToken);
	const loading = useSelector(authSelectors.getIsLoading);
	const router = useRouter();
	const pathname = router.pathname;
	const pathIsProtected = protectedRoutes.includes(pathname);

	useEffect(() => {
		if (!loading && !userToken && pathIsProtected) {
			router.push('/');
		}
	}, [pathIsProtected, loading, router, userToken]);

	if ((loading || !userToken) && pathIsProtected) {
		return <FullPageLoader />;
	}

	return <>{children}</>;
}
