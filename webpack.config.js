const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

module.exports = {
    devtool: "eval-source-map",
    output: {
        filename: "static/[name].js",
        path: dist,
        publicPath: "/"
    },
    entry: {
        main: path.resolve(src, 'index.js')
    },
    devServer: {
        contentBase: dist,
        publicPath: '/',
        host: "0.0.0.0",
        disableHostCheck: true,
        historyApiFallback: true,
        port: 9009,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(src, 'index.html')
        }),
    ],
    resolve: {
        alias: {
            "~": path.resolve(src),
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'static/img/',
                    publicPath: '/static/img/',
                },
            },
            {
                test: /\.(ttf)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'static/font/',
                    publicPath: '/static/font/',
                },
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true
                },
            }
        }
    }
}