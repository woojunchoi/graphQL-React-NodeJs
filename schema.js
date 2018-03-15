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

const data = [
    {id:'23', firstName:'bill', age:30},
    {id:'47', firstName:'samantha', age:12}
]

const UserType = new GraphQLObjectType({
    name:'User',
    fields: () => ({
        id:{type:GraphQLString},
        firstName:{type:GraphQLString},
        age:{type:GraphQLInt}
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        user:{
            type:UserType,
            args:{id: {type: GraphQLString}},
            resolve(parentValue,args) {
                for(let i=0; i<data.length; i++) {
                    if(data[i].id === args.id) {
                        console.log(data[i])
                        return data[i]
                    }
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery
})


// const CustomerType = new GraphQLObjectType({
//     name:'customer',
//     fields: () => ({
//         id:{type:GraphQLInt},
//         username:{type:GraphQLString},
//         email:{type:GraphQLString},
//         age:{type:GraphQLInt}
//     })
// })
// //Root Query
// const RootQuery = new GraphQLObjectType({
//     name:'rootQueryType',
//     fields: {
//         customer:{
//         type:CustomerType,
//         args:{
//             id:{type:GraphQLInt}
//         },
//         resolve(parentValue,args) {
//            const query = `SELECT * FROM "user" WHERE id = ${args.id}`
//            return db.conn.one(query)
//            .then((data) => {
//                return data
//            })
//            .catch((error) => {
//                return error;
//            })
//         }
//     },
//         customers: {
//             type: new GraphQLList(CustomerType),
//             resolve(parentValue, args) {
//             const query = `SELECT * FROM "user"`
//             return db.conn.many(query)
//             .then(data => data)
//             .catch(err => err)
//         }
//     }
// }
// })
// module.exports = new GraphQLSchema({
//     query:RootQuery
// })