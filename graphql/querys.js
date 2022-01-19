const { GraphQLList, GraphQLString } = require("graphql");
const { UserType } = require("./typedef");
const { User, Pending } = require("../models");

const users = {
    type: new GraphQLList(UserType),
    description: 'This is the hello query',
    async resolve() {
        const users = User.find();
        return users;
    }
}

const PedingReq = {
    type: GraphQLString,
    description: "Validating a pending request for reset password",
    args: {
        UserId: { type: GraphQLString },
    },
    async resolve(_, args) {
        const { UserId } = args;
        if (!UserId) {
            throw new Error("UserId is required");
        }

        const pending = await Pending.findOne({ UserId });
        if (!pending) {
            throw new Error("UserId is not found");
        }

        return "User found";


    }
}


module.exports = { users, PedingReq };