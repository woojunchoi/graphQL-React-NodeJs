//JSON HOOK UP JUST LIKE MONGO. BUT INSTEAD, I BUILT LOCAL JSON FILE TO SERVE
const axios = require("axios")

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')


const UserType = new GraphQLObjectType({
    name:'User',
    fields: () => ({
        id:{type:GraphQLString},
        firstName:{type:GraphQLString},
        age:{type:GraphQLInt},
        company:{
            type:CompanyType,
            resolve(parentValue,args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(resp => resp.data)
            }        
        }
    })
})

const CompanyType = new GraphQLObjectType({
    name:"CompnayType",
    fields:() => ({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        description:{type:GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        user:{
            type:UserType,
            args:{id: {type: GraphQLString}},
            resolve(parentValue,args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data)            }
        },
        company:{
            type:CompanyType,
            args:{id:{type:GraphQLString}},
            resolve(parentValue,args) {

            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery
})

// with POSTGRESQL
// const pgp = require('pg-promise')();
// const db = {}
// db.conn = pgp('postgres://atpboaqi:DFTtbV2mMDfodxiI1tboCkkOoTg26wIP@stampy.db.elephantsql.com:5432/atpboaqi')

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