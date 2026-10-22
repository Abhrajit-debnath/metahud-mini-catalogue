import jwt from "jsonwebtoken";



// helper function to generate a JWT token with a payload and a secret key

export function generateToken(payload: object){
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d' });
}

// helper function to verify a JWT token and return the decoded payload

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}