import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
	if (req?.method === 'GET') {
		const { token } = req.query;
		const secretKey = process.env.DOWNLOAD_SECRET_KEY;

		try {
			const result = jwt.verify(token, secretKey);
			if (result?.tracks) {
				res.status(200).json({ success: true, tracks: result.tracks });
			} else {
				res.status(400).json({ success: false });
			}
		} catch (error) {
			res.status(500).json({ success: false, error: 'Failed to decrypt token' });
		}
	} else {
		res.status(405).end('Method Not Allowed');
	}
}
