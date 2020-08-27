const neo4j = require('neo4j-driver')

class Neo4JDriver {

    constructor({ uri, username, password }){
        this.driver = neo4j.driver(
            uri,
            neo4j.auth.basic( username, password)
        )

        process.on('exit', async () => {
            await this.driver.close()
        })
    }

    async run( cypher, params ){
        const session = this.driver.session()
        const results = await session.run( cypher, params )
        await session.close()
        return results
    }

}

module.exports = Neo4JDriver
