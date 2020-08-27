const fs = require('fs')
const path = require('path')

exports.loadModels = ( modelsFolder, driver ) => {
    const modelPaths = _collectFiles( modelsFolder )
    return _createModelInstances( modelPaths, driver )
}

function _createModelInstances( modelPaths, driver ){
    const models = {};
    for( const modelPath of modelPaths ){
        const modelName = path.basename( modelPath, '.js' )
        const ModelClass = require( modelPath )
        ModelClass.driver = driver // TODO: this is string - how to get the driver instance into the static classes?
        models[modelName] = ModelClass
    }
    return models
}

function _collectFiles( directoryPath ){
    return fs.readdirSync( directoryPath ).reduce( ( collector, file ) => {
        const filepath = path.join( directoryPath, file );
        const stat = fs.statSync( filepath );

        if( stat.isDirectory() ){
            return [...collector, ..._collectFiles( filepath ) ];
        }else if( stat.isFile() ){
            if( path.extname( filepath ) === '.js' ){
                collector.push( filepath );
            }
        }

        return collector;
    }, [] )
}