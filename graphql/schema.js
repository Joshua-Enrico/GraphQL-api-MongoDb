const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { users } = require('./querys');
const { register, login } = require('./mutation');

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'This is the root query',
    fields: {
        users: users
    }
})



const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'This is the root mutation',
    fields: {
        register,
        login
    }
})


const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})

module.exports  = schema;