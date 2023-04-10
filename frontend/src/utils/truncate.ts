export const truncate = (
  value: string,
  startingNumber = 6,
  endingNumber = 4
) => {
  return `${value.slice(0, startingNumber)}...${value.slice(
    value.length - endingNumber
  )}`;
};
