export function getCurrentMenuName(path, isMyProfile) {
	if (path.includes('/bap-info')) {
		return 'B.A.P. info';
	}
	if (path.includes('/dashboard')) {
		return 'B.A.P. dashboard';
	}
	if (path.includes('/mailing')) {
		return 'B.A.P. mailing list';
	}
	if (path.includes('/releases')) {
		return 'B.A.P. releases';
	}
	if (path.includes('/web-pages')) {
		return 'B.A.P. web pages';
	}
	if (path.includes('/splits-contracts')) {
		return 'B.A.P. splits & contracts';
	}
	if (path.includes('/analytics')) {
		return 'B.A.P. analytics';
	}
	if (path.includes('/income')) {
		return 'B.A.P. income';
	}
	if (path.includes('/my-splits-contracts')) {
		if (isMyProfile) {
			return 'My Profile';
		}
		return 'My splits & contracts';
	}
	if (path.includes('/my-income')) {
		if (isMyProfile) {
			return 'My Profile';
		}
		return 'My income';
	}
}
