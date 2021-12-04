import isAuth from "../../utils/checkAuth"

export default {
  Query: {
    hello: async (_, args, ctx) => {
      return "hello world"
    },
    getMe: async (_, args, { req, controllers }) => {
      const userId = await isAuth(req)
      return await controllers.user.getMe(userId)
    },
    renewToken: async (_, { token }, { controllers }) => await controllers.user.renewToken(token)
  },
  Mutation: {
    register: async (_, { registerInput }, { controllers }) => {
      console.log(registerInput)
      return await controllers.user.register(registerInput)
    },
    login: async (_, args, { controllers }) => await controllers.user.login(args),
    socialLogin: async (_, { idToken }, { controllers }) => await controllers.user.socialLogin(idToken),
    logout: async (_, args, { controllers }) => await controllers.user.logout()
  }
}