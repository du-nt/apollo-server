import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import User from '../models/User';

const isAuth = async (req) => {
    try {
        const authHeader = req.get("Authorization")

        if (!authHeader) throw new AuthenticationError('Authorization header must be provided');

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!decoded) throw new AuthenticationError('Invalid/Expired token')

        const user = await User.findOne({ _id: decoded.id })

        return { user: "hello" }
    } catch (error) {
        throw new AuthenticationError(error.message)
    }

}

export default isAuth