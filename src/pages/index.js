import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import AuthSection from '@/components/Auth/AuthSection/AuthSection';
import AuthLayout from '@/components/Layouts/AuthLayout';

const AuthPage = () => {
	const { inviteToken } = useSelector(state => state.auth);
	const [isSignIn, setIsSignIn] = useState(!inviteToken);

	return (
		<AuthLayout
			title={isSignIn ? 'Sign in' : 'Sign up'}
			description='Major Labl Artist Club - a place for creativity and inspiration. Discover the most talented artists and unique artworks. Join us and explore the world of art.'
		>
			<AuthSection isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
		</AuthLayout>
	);
};

export default AuthPage;

export async function getServerSideProps({ req }) {
	const session = await getSession({ req });
	return {
		props: { session },
	};
}
