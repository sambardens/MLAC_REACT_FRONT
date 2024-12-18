function getPreparedPendingInvites(invites) {
  const preparedPendingInvites = [];
  const emails = [];

  invites.forEach((inv) => {
    if (inv.email && !emails.includes(inv.email)) {
      preparedPendingInvites.push(inv);
      emails.push(inv.email);
    }
  });

  return preparedPendingInvites;
}

export default getPreparedPendingInvites;
