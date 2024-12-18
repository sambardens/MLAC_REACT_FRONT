function checkIsInclude(baseString, arg) {
  const baseStringN = baseString.toLowerCase();
  const argN = arg.toLowerCase();

  return baseStringN.includes(argN);
}

export default checkIsInclude;
