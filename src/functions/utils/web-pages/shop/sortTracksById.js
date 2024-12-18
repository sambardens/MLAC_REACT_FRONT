export const sortTracksById = (tracks) => {
  return tracks.sort((a, b) => a.id - b.id);
};
