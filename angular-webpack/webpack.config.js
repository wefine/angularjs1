const path = require('path');

module.exports = {
    context: __dirname + '/app',
    entry: './index.js',
    output: {
        path: __dirname + '/app',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    },
    plugins : [
    ],
    devServer: {
        contentBase: path.join(__dirname, "app"),
        compress: true,
        port: 9000
    }
};