import isAuth from "../../utils/checkAuth"

export default {
  Query: {
    hello: async (_, args, ctx) => {
      // const user = await isAuth(ctx.req)
      // console.log(user)
      return "hello man1"
    }
  },
  Mutation: {
    register: async (_, { registerInput }, { controllers }) => await controllers.user.register(registerInput),
    login: async (_, args, { controllers }) => await controllers.user.login(args),
    socialLogin: async (_, { idToken }, { controllers }) => await controllers.user.socialLogin(idToken),
    logout: async (_, args, { controllers }) => await controllers.user.logout()
  }
}