const Neo4JDriver = require('./drivers/Neo4JDriver')
const modelLoader = require('./lib/modelLoader')

class CypherOMG {

    constructor( options ){
        this.driver = new Neo4JDriver( options )
        this.models = {}
    }

    loadModels( modelsPath ){
        const models = modelLoader.loadModels( modelsPath, this.driver )
        this.models = { ...this._models, ...models }
        return this
    }

    run( ...args ){
        return this.driver.run( ...args )
    }
    
}

module.exports = CypherOMG
