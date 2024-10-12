import bcrypt from 'bcrypt';

export const hashString = async (
  plainText: string,
  saltRounds = 10,
): Promise<string> => {
  const hash = await bcrypt.hash(plainText, saltRounds);
  return hash;
};

export const isHashValid = async (
  plainText: string,
  hashText: string,
): Promise<boolean> => {
  const isValid = await bcrypt.compare(plainText, hashText);
  return isValid;
};
