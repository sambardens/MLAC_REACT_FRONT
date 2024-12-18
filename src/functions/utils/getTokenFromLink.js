function getTokenFromLink(value) {
  if (!value.includes('=')) {
    return value;
  }

  const token = value.split('=')[1];

  return token;
}

export default getTokenFromLink;
