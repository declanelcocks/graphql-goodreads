const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = require('graphql')

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: '...',
  fields: () => ({
    title: {
      type: GraphQLString,
      // resolves data to type `GraphQLString` above
      resolve: book => book.title[0],
    },
    isbn: {
      type: GraphQLString,
      // resolves data to type `GraphQLString` above
      resolve: book => book.isbn[0],
    },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: '...',

  fields: () => ({
    name: {
      type: GraphQLString,
      // resolves data to type `GraphQLString` above
      resolve: xml => xml.GoodreadsResponse.author[0].name[0],
    },
    books: {
      type: new GraphQLList(BookType),
      // resolves data to type `BookType`
      resolve: xml => xml.GoodreadsResponse.author[0].books[0].book,
    },
  }),
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLInt }
        },
        // resovles data to type `AuthorType`
        resolve: (root, args) => fetch(
          `https://www.goodreads.com/author/show.xml?id=${args.id}&key=yyD6gSJ5YDZJPrZXLQkBA`
        ).then(response => response.text()).then(parseXML)
      },
    }),
  })
})
