const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => ({
    mode: 'development',
    entry: './src/index.tsx',
    devServer: {
        open: true,
        hot: true,
        host: 'localhost',
        historyApiFallback: true
    },
    devtool: 'eval-cheap-source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'js'],
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: ['/node_modules/'],
                loader: 'ts-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: ['/node_modules'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: [
                            ["polyfill-regenerator", { "method": "usage-global" }] // because of recoil
                        ]
                    }
                }
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new CleanWebpackPlugin(),
    ],
})