import addReleaseToShop from './addReleaseToShop';
import editSettingsReleaseShop from './editSettingsReleaseShop';
import removeReleaseFromShop from './removeReleaseFromShop';

async function checkAndSaveReleases(shopId, releasesOnServer = [], newSelectedReleases = []) {
	const releasesNeedToBeAdded = [];

	const checkIsAlreadySavedOnServer = checkedRel => {
		const isAlreadySaved = releasesOnServer.some(rel => rel.id === checkedRel?.id);

		return isAlreadySaved;
	};

	const checkWasDeleted = checkedRel => {
		const wasDeleted = newSelectedReleases.every(rel => rel.id !== checkedRel?.id);

		return wasDeleted;
	};

	newSelectedReleases.forEach(rel => {
		if (!checkIsAlreadySavedOnServer(rel)) {
			releasesNeedToBeAdded.push(rel.id);
		}
	});

	releasesOnServer.forEach(async rel => {
		const wasDeleted = checkWasDeleted(rel);

		if (wasDeleted) {
			removeReleaseFromShop(shopId, rel.id);
		}
	});

	if (releasesNeedToBeAdded.length) {
		await addReleaseToShop(shopId, {
			releaseIds: releasesNeedToBeAdded,
		});
	}

	const findOldReleaseVersion = updatedRel => {
		const oldReleaseVersion = releasesOnServer.find(oldRel => oldRel.id === updatedRel);

		return oldReleaseVersion;
	};

	newSelectedReleases.forEach(async updatedRel => {
		if (updatedRel.backgroundBlur !== findOldReleaseVersion(updatedRel)) {
			const data = new FormData();
			data.append('backgroundBlur', `${updatedRel.backgroundBlur}`);

			await editSettingsReleaseShop(data, shopId, updatedRel.id);
		}
	});
}

export default checkAndSaveReleases;
