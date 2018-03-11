const pgp = require('pg-promise')();
const db = {}
db.conn = pgp('postgres://atpboaqi:DFTtbV2mMDfodxiI1tboCkkOoTg26wIP@stampy.db.elephantsql.com:5432/atpboaqi')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

//hardcoded data


const CustomerType = new GraphQLObjectType({
    name:'customer',
    fields: () => ({
        id:{type:GraphQLInt},
        username:{type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt}
    })
})
//Root Query
const RootQuery = new GraphQLObjectType({
    name:'rootQueryType',
    fields: {
        customer:{
        type:CustomerType,
        args:{
            id:{type:GraphQLInt}
        },
        resolve(parentValue,args) {
           const query = `SELECT * FROM "user" WHERE id = ${args.id}`
           return db.conn.one(query)
           .then((data) => {
               return data
           })
           .catch((error) => {
               return error;
           })
        }
    },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
            const query = `SELECT * FROM "user"`
            return db.conn.many(query)
            .then(data => data)
            .catch(err => err)
        }
    }
}
})
module.exports = new GraphQLSchema({
    query:RootQuery
})