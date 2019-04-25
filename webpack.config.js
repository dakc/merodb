const path = require('path');
module.exports = {
    // mode:'development',
    mode: 'production',
    target: 'web',
    entry: {
        'merodb.min': ['@babel/polyfill','./src/merodb.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'MeroDB',
        // commnet: '/* MeroDB 2.0.0 | © 2019 dakc | MIT liscense */'
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