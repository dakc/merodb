const path = require('path');
module.exports = {
    // mode:'development',
    mode: 'production',
    target: 'node',
    entry: {
        'merodb.min': './src/merodb.js',
        'merodb.node': './index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'MeroDB',
        // commnet: '/* MeroDB 1.0.0 | © 2019 dakc | MIT liscense */'
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            }]
        }]
    }
}