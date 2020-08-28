const CypherOMGModel = require('../../src/CypherOMGModel');

class User extends CypherOMGModel {

    define( Joi ){
        return {
            name: Joi.string(),
            title: Joi.string().uppercase().trim()
        }
    }

    static findByName( name ){
        return this.run(`MATCH(n:${this.label} { name: $name }) RETURN n`, { name })
    }

}

module.exports = User
