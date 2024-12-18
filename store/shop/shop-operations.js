import { createAsyncThunk } from '@reduxjs/toolkit';
import prepareContract from 'src/functions/utils/prepareContract';
import prepareSplit from 'src/functions/utils/prepareSplit';
import { instance } from 'store/operations';

export const getDealsInShopByBapId = createAsyncThunk(
	'shop/getDealsInShopByBapId',
	async ({ bapId, userId }, { rejectWithValue }) => {
		try {
			const { data } = await instance.get(`/api/contracts/splits/pending?bapId=${bapId}`);
			if (data?.success) {
				const contracts = data.contracts.map(el => {
					const { tracks, users, ...contract } = el;
					return prepareContract({
						contract: { ...contract, splitTracks: tracks, splitUsers: users },
						userId,
						allDeals: [...data.contracts, ...data.splits],
					});
				});

				const splits = data.splits.map(el => {
					const { tracks, users, id, ...split } = el;
					return prepareSplit({
						split: { ...split, splitTracks: tracks, splitUsers: users, splitId: id },
						userId,
						allDeals: [...contracts],
					});
				});

				return {
					success: true,
					splitsAndContracts: [...contracts, ...splits],
				};
			}
			return { success: false, splitsAndContracts: [] };
		} catch (error) {
			console.log('getDealsInShopByBapId: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);

export const deleteTrackFromCartInShop = createAsyncThunk(
	'shop-user/deleteTrackFromCartInShop',
	async ({ trackId, shopId }, { rejectWithValue }) => {
		const data = { trackId };
		try {
			await instance.delete(`/api/customers/shops/basket/${shopId}`, { data });
			return { success: true, trackId };
		} catch (error) {
			console.log('deleteTrackFromCartInShop: ', error);
			return rejectWithValue({ error: error?.response?.data?.message || error.message });
		}
	},
);
