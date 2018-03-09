const express = require('express');
const expressGraphQL = require('express-graphql')

const app = express()

app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}))

app.listen(4000, () => {
    console.log('listening to 4000')
})
