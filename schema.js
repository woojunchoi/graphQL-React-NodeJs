const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

//hardcoded data

const customer = [
    {id:'1', name:'John Doe', email:'johndoe@gmail.com', age:35},
    {id:'2', name:'Steve Smith', email:'stevesmith@gmail.com', age:25},
    {id:'3', name:'Sarah Williams', email:'sarah@gmail.com', age:32}
]

const CustomerType = new GraphQLObjectType({
    name:'customer',
    fields: () => ({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
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
            id:{type:GraphQLString}
        },
        resolve(parentValue,args) {
            for(let i=0; i<customer.length; i++) {
                if(customer[i].id === args.id) {
                    return customer[i]
                }
            }
            
        }
    },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
            return customer
        }
    }
}
})
module.exports = new GraphQLSchema({
    query:RootQuery
})