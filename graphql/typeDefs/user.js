import { gql } from "apollo-server-express"

export default gql`
type Query {
    hello: String
    getMe: User!
    renewToken(token: String!): Token!
}
input RegisterInput {
    displayName: String
    email: String!
    password: String!
    confirmPassword: String!
}
type Token {
    accessToken: String!
    refreshToken: String!
}
type User {
    _id: ID!
    displayName: String!
    email: String!
}
type AuthUser {
    user: User!
    accessToken: String!
    refreshToken: String!
}
type Mutation {
    register ( registerInput : RegisterInput): User!
    login(email: String!, password: String!): AuthUser!
    socialLogin (idToken: String!): AuthUser!
    logout: Boolean!
}
`