const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        
        authors: [String]
        bookId: ID
        description: String
        title: String
        image: String
        link: String
    }
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }
    type Auth {
        token: ID!
        user: User
    }
    input BookInput{
        authors: [String]
        description: String
        title: String
        bookId: ID!
        image: String
        link: String
    }
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: BookInput): User
        removeBook(bookId: ID!): User
    }
`;

module.exports = typeDefs;


// const SavedBooks = () => {
//     const { loading, data } = useQuery(GET_ME);
//     const [deleteBook] = useMutation(REMOVE_BOOK);
//     const userData = data?.me || {};
  
//     if(!userData?.username) {
//       return (
//         <h4>
//           You need to be logged in to see this page. Use the navigation links above to sign up or log in!
//         </h4>
//       );
//     }
  
//      // create function that accepts the book's mongo _id value as param and deletes the book from the database
//      const handleDeleteBook = async (bookId) => {
//       const token = Auth.loggedIn() ? Auth.getToken() : null;
  
//       if (!token) {
//         return false;
//       }
  
//       try {
//         await deleteBook({
//           variables: {bookId: bookId},
//           update: cache => {
//             const data = cache.readQuery({ query: GET_ME });
//             const userDataCache = data.me;
//             const savedBooksCache = userDataCache.savedBooks;
//             const updatedBookCache = savedBooksCache.filter((book) => book.bookId !== bookId);
//             data.me.savedBooks = updatedBookCache;
//             cache.writeQuery({ query: GET_ME , data: {data: {...data.me.savedBooks}}})
//           }
//         });
//         // upon success, remove book's id from localStorage
//         removeBookId(bookId);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     // if data isn't here yet, say so
//     if (loading) {
//       return <h2>LOADING...</h2>;
//     }