import { UserInputError, AuthenticationError } from "apollo-server-express"

import User from "../models/User";
import { generateToken, generateRefreshToken } from "../utils/generateToken";
import { validateRegisterInput, validateLoginInput } from "../utils/validators"
import admin from '../firebase-config'

const register = async (registerInput) => {
    try {
        const { isValid, errors } = validateRegisterInput(registerInput);

        if (!isValid) {
            throw new UserInputError('Invalid inputs', { errors });
        }

        const { email, displayName, password } = registerInput;

        const user = await User.findOne({ email })
        if (user) {
            errors.email = "Email was used";
            throw new UserInputError('Invalid email', { errors });
        }

        const newUser = new User({
            displayName,
            email,
            password,
        });
        await newUser.save();

        return newUser
    } catch (err) {
        throw new UserInputError(err.message, { ...err.extensions });
    }
};

const login = async (data) => {
    try {
        const { isValid, errors } = validateLoginInput(data);

        if (!isValid) {
            throw new UserInputError('Invalid inputs', { errors });
        }

        const user = await User.findOne({ email: data.email })

        if (!user) {
            errors.email = "Email not found";
            throw new UserInputError('Email not found', { errors });
        }

        if (!user.password) {
            errors.email = "Your account was registered using a sign-in provider";
            throw new UserInputError('Duplicate email address', { errors });
        }

        const isMatch = await user.comparePassword(data.password)

        if (!isMatch) {
            errors.password = "Password is incorrect";
            throw new UserInputError('Password is incorrect', { errors });
        }

        const accessToken = generateToken({ id: user._id })
        const refreshToken = generateRefreshToken({ id: user._id })

        return {
            user: {
                ...user._doc,
                password: ''
            }, accessToken,
            refreshToken
        }

    } catch (err) {
        throw new UserInputError(err.message, { ...err.extensions });
    }
}

const socialLogin = async (idToken) => {
    try {
        const decodedValue = await admin.auth().verifyIdToken(idToken)

        const query = { googleId: decodedValue.uid };
        const update = {
            email: decodedValue.email,
            googleId: decodedValue.uid,
            displayName: decodedValue.name,
            avatar: decodedValue.picture,
        };
        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        };

        const user = await User.findOneAndUpdate(query, update, options);

        const accessToken = generateToken({ id: user._id })
        const refreshToken = generateRefreshToken({ id: user._id })

        return {
            user: {
                ...user._doc,
                password: ''
            }, accessToken,
            refreshToken
        }
    } catch (error) {
        throw new AuthenticationError("Decoding Firebase ID token failed")
    }

}

const logout = async () => {
    return true
}

const getMe = async (_id) => {
    try {
        const user = await User.findOne({ _id })
        return {
            ...user._doc,
            password: ''
        }
    } catch (error) {
    }
}

const refreshAccessToken = async (token) => {
    try {
        console.log(token)
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        if (!decoded) throw new AuthenticationError('Invalid/Expired refresh token')

        const user = await User.findOne({ _id: decoded.id })
        if (!user) throw new AuthenticationError('This account does not exist')

        const accessToken = generateToken({ id: user._id })
        const refreshToken = generateRefreshToken({ id: user._id })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new AuthenticationError(error.message)
    }
}

export default { register, login, socialLogin, logout, getMe, refreshAccessToken }