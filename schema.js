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
    //closure. since types are circular, need to use closure 
    //so each type has access to other types regardless order of functions.
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
        description:{type:GraphQLString},
        users:{ // need to use GraphQLList since this resolve returns more than one .
            type:new GraphQLList(UserType),
            resolve(parentValue,args){
                console.log(parentValue)
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res => res.data)
            }
        }
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
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then((res => res.data))
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name:"Mutation",
    fields: {
        addUser:{
            type:UserType,
            args:{
                firstName:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)},
                companyId:{type:GraphQLString}
            },
            resolve(parentValue,{firstName, age}) {
                return axios.post(`http://localhost:3000/users`,{firstName, age})
                .then(res => res.data)
            }
        },
        deleteUser: {
            type:UserType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue,args) {
                return axios.delete(`http://localhost:3000/users/${args.id}`)
                .then(res => res.data)
            }

        },
        updateUser: {
            type:UserType,
            args: {
                id:{type: new GraphQLNonNull(GraphQLString)},
                firstName:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)},
                companyId:{type:GraphQLString}
            },
            resolve(parentValue, {id, firstName, age}) {
                return axios.patch(`http://localhost:3000/users/${id}`, {id, firstName, age})
                .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
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