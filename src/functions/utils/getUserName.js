const getUserName = (user) => {
    if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName && !user.lastName) {
        return user.firstName;
    }
    return user.email;
}

export default getUserName