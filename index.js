import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from "dotenv"
// import cors from "cors"

import connectDB from './connectDB';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import controllers from './controllers'

dotenv.config()

const port = process.env.PORT || 5000;
const app = express()

// app.use(cors())

connectDB()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, controllers })
})

await server.start();

server.applyMiddleware({ app })

app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
});