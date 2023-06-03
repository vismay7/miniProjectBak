import { JwtPayload, Secret, verify } from "jsonwebtoken";

export const decodeJwt = (token: string) => {
  try {
    const decodeUserInfo = verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
    return decodeUserInfo;
  } catch (error) {
    return error;
  }
};
