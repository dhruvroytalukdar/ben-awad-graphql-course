import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
//import { Post } from './entities/Post';
import mikroInit from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/posts';


const main = async () => {
    const orm = MikroORM.init(mikroInit);
    await (await orm).getMigrator().up();

    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: async () => ({ em: (await orm).em })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Server started at port 4000");
    })
}

main();

console.log("Hello There");
