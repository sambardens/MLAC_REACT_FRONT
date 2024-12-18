const getSelectedReleaseFilter = (filters) => {
  let selectedFilter;
  const selectedRelease = filters?.releaseFilter?.release;
  const selectedTrack = filters?.releaseFilter?.track;

  if (selectedRelease) {
    selectedFilter = selectedRelease.name;
  }

  if (selectedTrack) {
    selectedFilter = selectedTrack.name;
  }

  if (!selectedRelease && !selectedTrack) {
    selectedFilter = 'All tracks';
  }

  return selectedFilter;
};

export default getSelectedReleaseFilter;
