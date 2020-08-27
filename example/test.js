( async () => {
    const CypherOMG = require('../src')

    const cypherOMG = new CypherOMG({
        uri: 'bolt://localhost:7687/neo4j',
        username: 'neo4j',
        password: 'generalpassword'
    }).loadModels( __dirname + '/models' )

    const { User } = cypherOMG.models

    //const result = await cypherOMG.run(`CREATE (n:User { name: 'Andy', title: 'Developer' })`)
    const { records: [user] } = await User.findAll()
    console.log('FUCK YEA', user.name, user )

    user.name = 'shit'
    console.log('DOUBLE FUCK YEA', user.changes, user.name )
})()
