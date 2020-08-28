
const neo4j = require('neo4j-driver')
const { Record } = neo4j.types
const Joi = require('joi');

class CyperOMGModel {

    constructor({ labels, properties, identity } = {} ){
        if( labels && labels.indexOf( this.label ) === -1 ) throw new Error(`This data does not contain the correct label for this model: '${this.label}' is not in '${labels.join(', ')}'.`)
        this._changes = []
        this._schema = null
        this._labels = labels
        this._identity = identity
        this._properties = this.validate( properties )
        this.defineProperties()
    }

    get label(){
        return this.constructor.name
    }

    static get label(){
        return this.name
    }

    get schema(){
        if( this._schema ) return this._schema
        this._schema = this.define( Joi )
        return this._schema
    }

    get changes(){
        return Object.keys( this._changes )
    }

    get dirty(){
        return this.changes.length > 0
    }

    define( Joi ){
        throw new Error(`Subclasses of CypherOMGModel must implement the 'define( Joi ){}' function and return a schema.`)
    }

    defineProperties(){
        for( const propertyName in this.schema ){
            this.defineProperty( propertyName )
        }
    }

    defineProperty( propertyName ){
        Object.defineProperty( this, propertyName, {
            get: () => { 
                console.log(`GET-${propertyName}`)
                return this._properties[propertyName]
            },
            set: newValue => {
                console.log(`SET-${propertyName}=${newValue}`)
                this._properties[propertyName] = newValue
                if( !this._changes[propertyName] ) this._changes[propertyName] = true
            }
        });
    }

    validate( properties ){
        const { error, value } = Joi.object( this.schema ).validate( properties )
        if( error ) throw error
        return value
    }

    static run( cypher, params ){
        return this.driver.run( cypher, params )
    }

    run( cypher, params ){
        return this.driver.run( cypher, params )
    }

    static async findAll(){
        const { records: [ record ], summary } = await this.run(`MATCH(n:${this.label}) RETURN n`)
        const inflatedRecords = this.inflateModels( record )
        return { records: inflatedRecords, summary }
    }

    static inflateModels( record ){
        if( !record ) return null
        return record.map( this.inflateModel.bind( this ) )
    }

    static inflateModel( record ){
        if( !record ) return null
        return new (this)( record )
    }

}

module.exports = CyperOMGModel
