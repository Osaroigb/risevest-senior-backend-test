import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appConfig from 'src/config/app';

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

export const generateJwt = (payload: {
  data?: { [key: string]: any };
  sub?: string;
}): { token: string } => {
  const secretKey = appConfig.get('jwt.secretKey');
  const expiryInSeconds = appConfig.get('jwt.expiry');

  const token = jwt.sign(payload, secretKey, {
    algorithm: 'HS256',
    issuer: 'risevest',
    expiresIn: expiryInSeconds,
  });

  return { token };
};

export const verifyJwt = (jwtToken: string): string | jwt.JwtPayload => {
  const secretKey = process.env.JWT_SECRET_KEY as string;

  const decoded = jwt.verify(jwtToken, secretKey, {
    issuer: 'risevest',
    algorithms: ['HS256'],
  });

  return decoded;
};
