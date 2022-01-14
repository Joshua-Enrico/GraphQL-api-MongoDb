const { GraphQLList } = require("graphql");
const { UserType } = require("./typedef");
const { User } = require("../models");

const users = {
    type: new GraphQLList(UserType),
    description: 'This is the hello query',
    async resolve() {
        const users = User.find();
        return users;
    }
}

module.exports = { users };