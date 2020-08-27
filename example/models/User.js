const CyperOMGModel = require('../../src/CyperOMGModel');

module.exports = class User extends CyperOMGModel {

    define( Joi ){
        return {
            name: Joi.string(),
            title: Joi.string().uppercase().trim()
        }
    }

}
