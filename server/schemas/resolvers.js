const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                return User.findOne({ _id: context.user._id }).populate('savedBooks')
            }
            throw new AuthenticationError('You need to be logged in.');
        },
    },
    Mutation: {
        addUser: async(parent, { username, email, password }, context) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async(parent, { email, password }, context) => {
            const user = await User.findOne({ email });
            if(!user){
                throw new AuthenticationError('No user found with this email.')
            }
            // check utils for isCorrectPassword function
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw){
                throw new AuthenticationError('Incorrect credentials.');
            }

            const token = signToken(user);
            return{ token, user };
        },
        saveBook: async(parent, { book }, context) => {
            if(context.user){
                const userBooks = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true }
                )
                return userBooks;
            }
        },
        removeBook: async(parent, { bookId }, context) => {
            if(context.user){
                const userBooks = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return userBooks;
            }
            throw new AuthenticationError('You need to be logged in.');
        },
    },
};

module.exports = resolvers;