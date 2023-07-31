import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import graphQLSchema from '../graphql/schema';
import graphQLResolvers from '../graphql/resolvers';
const router = express.Router();

router.post(
    '/',
    graphqlHTTP({
        schema: graphQLSchema,
        rootValue: graphQLResolvers,
        graphiql: false,
    }),
);

router.get(
    '/',
    graphqlHTTP({
        schema: graphQLSchema,
        rootValue: graphQLResolvers,
        graphiql: true,
    }),
);

export default router;
