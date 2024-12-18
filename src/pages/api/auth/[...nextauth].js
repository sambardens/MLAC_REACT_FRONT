import NextAuth from 'next-auth/next';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,

			profile(profile) {
				return {
					id: profile.id,
					name: profile.display_name,
					email: profile.email,
					image: profile.images?.[0]?.url || null,
				};
			},
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	// callbacks: {
	// 	async jwt({ token, account, profile }) {
	// 		if (account?.provider === 'spotify') {
	// 			token.id = profile.id;
	// 		}
	// 		return token;
	// 	},
	// 	async session({ session, token }) {
	// 		if (token?.id) {
	// 			session.user.spotifyId = token.id;
	// 		}
	// 		return session;
	// 	},
	// },
};

export default async function Auth(req, res) {
	return await NextAuth(req, res, authOptions);
}
