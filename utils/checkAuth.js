import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

const isAuth = async (req) => {
    try {
        const authHeader = req.get("Authorization")

        if (!authHeader) throw new AuthenticationError('Authorization header must be provided');

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!decoded) throw new AuthenticationError('Invalid/Expired token')

        return decoded.id
    } catch (error) {
        throw new AuthenticationError(error.message)
    }

}

export default isAuth