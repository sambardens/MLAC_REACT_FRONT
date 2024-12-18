import { resetAuthState } from 'store/auth/auth-slice';
import { resetUserState } from 'store/slice';

const resetAuth = dispatch => {
	dispatch(resetAuthState());
	dispatch(resetUserState());
};

export default resetAuth;
