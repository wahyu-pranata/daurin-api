import * as jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: object) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '16h',
  });
  
  const refreshToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '7d',
  });
  
  return {accessToken, refreshToken};
}

export const decodeToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
}