import { gql } from "apollo-server-express"

export default gql`
type Query {
    hello: String
}
input RegisterInput {
    displayName: String
    email: String!
    password: String!
    confirmPassword: String!
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