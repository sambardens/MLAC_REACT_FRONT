function parseName(name) {
    const words = name.split(' ');
    const firstName = words[0];
    const lastName = words.slice(1).join(' ');
    return { firstName, lastName };
  }

  export default parseName