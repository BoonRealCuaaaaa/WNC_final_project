export const generateAccountNumber = () => {
  const randomSegment = () => Math.floor(100 + Math.random() * 900);
  return `${randomSegment()}${randomSegment()}${randomSegment()}${randomSegment()}`;
};
