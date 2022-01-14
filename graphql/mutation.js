const JSON = require("nodemon/lib/utils");
const { GraphQLString, GraphQLObjectType, GraphQLList } = require("graphql");
const { User } = require("../models")
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { generateToken } = require("../utils/auth");
const { validateRegisArgs } = require("../utils/validations/registVal");
const { LoginType } = require("./typedef");

const register = {
    type: GraphQLString,
    description: "Register a new user",
    args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        role: { type: GraphQLString }
    },
    async resolve (_, args) {

        const validate = validateRegisArgs(args);
        if (validate.isValid == false) {
            throw new Error(validate.message);
        }

        const { username, password, email, firstName, lastName, role } = args;
        
        const user = await User.findOne({ username });
        const emailExist = await User.findOne({ email });
        if (user || emailExist) {
            if (user) {
                throw new Error("Username already exist");
            } else {
                throw new Error("Email already exist")
            }
        }
        const newUser = new User({
            username: username,
            password: CryptoJS.AES.encrypt(password, process.env.PASSPHRASE).toString(),
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: role,
        });
        const SavedUser = await newUser.save()
        return SavedUser;
    },

};

const login = {
    type: new GraphQLObjectType(LoginType),
    description: "Login a user",
    args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve (_, args) {
        const { username, password } = args;
        if (!username || !password) {
            throw new Error("Please enter all arguments!");
        }
        const user = await User.findOne({ username: username });
        if (!user) {
            throw new Error("User not found");
        }
        const decrypted = CryptoJS.AES.decrypt(user.password, process.env.PASSPHRASE).toString(CryptoJS.enc.Utf8);
        if (decrypted !== password) {
            throw new Error("Icorrect password");
        }
        const token = generateToken(user);
        user.token = token;
        return user;
    }
}


module.exports = { register, login };