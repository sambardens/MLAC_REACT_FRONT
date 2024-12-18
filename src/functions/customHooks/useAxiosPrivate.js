import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { authSelectors } from 'store/auth';
import { refresh } from 'store/auth/auth-operations';
import { instance } from 'store/operations';

export const useAxiosPrivate = () => {
	const accessToken = useSelector(authSelectors.getUserToken);
	const oldToken = useSelector(authSelectors.getRefreshToken);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!oldToken) return;
		const requestIntercept = instance.interceptors.request.use(
			config => {
				if (!config.headers.Authorization) {
					config.headers.Authorization = `Bearer ${accessToken}`;
				}

				return config;
			},
			error => Promise.reject(error),
		);

		const responseIntercept = instance.interceptors.response.use(
			response => response,
			async error => {
				const prevRequest = error?.config;
				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;
					setToken('');
					const res = await dispatch(refresh(oldToken));
					if (res?.payload?.success) {
						prevRequest.headers.Authorization = `Bearer ${res?.payload?.jwtToken}`;
						return instance(prevRequest);
					}
				}
				return Promise.reject(error);
			},
		);
		return () => {
			instance.interceptors.request.eject(requestIntercept);
			instance.interceptors.response.eject(responseIntercept);
		};
	}, [accessToken, dispatch, oldToken]);

	return instance;
};
