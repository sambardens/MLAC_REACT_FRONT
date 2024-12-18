import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from 'store/operations';
import { setUser } from 'store/slice';

import UserProfile from '../UserProfileModal';

import { CreateNewBAPModal } from './CreateNewBAPModal';
import { InviteLinkModal } from './InviteLinkModal';
import { JoinToBAPModal } from './JoinToBAPModal';

const FirstVisit = () => {
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.user);
	const [currentModal, setCurrentModal] = useState('createProfile');

	useEffect(() => {
		if (currentModal === null) {
			if (user.lastName) {
				dispatch(saveUserData({ isNew: false }));
			} else {
				dispatch(setUser({ ...user, isNew: false }));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentModal, dispatch]);

	return (
		<>
			{currentModal === 'createProfile' && (
				<UserProfile
					closeModal={() => setCurrentModal(null)}
					goToNextModal={() => setCurrentModal('joinToBap')}
					firstVisit={true}
				/>
			)}

			{currentModal === 'joinToBap' && (
				<JoinToBAPModal
					closeModal={() => setCurrentModal(null)}
					goBack={() => setCurrentModal('createProfile')}
					setCurrentModal={setCurrentModal}
					firstVisit={true}
				/>
			)}

			{currentModal === 'createBap' && (
				<CreateNewBAPModal
					closeModal={() => setCurrentModal(null)}
					goBack={() => setCurrentModal('joinToBap')}
					setCurrentModal={setCurrentModal}
					firstVisit={true}
				/>
			)}

			{currentModal === 'inviteLink' && (
				<InviteLinkModal
					closeModal={() => setCurrentModal(null)}
					goBack={() => setCurrentModal('joinToBap')}
					setCurrentModal={setCurrentModal}
					firstVisit={true}
				/>
			)}
		</>
	);
};

export default FirstVisit;
