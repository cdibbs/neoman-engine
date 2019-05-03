const path = require('path');
const webpack = require('webpack');
const BAP = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        'neoman-engine': './src/lib/index.ts',
        'neoman-engine.min': './src/lib/index.ts'
    },
    output: {
        path: path.resolve(__dirname, '_bundles'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'NeomanEngine',
        umdNamedDefine: true,
    },
    mode: "production",
    //plugins: [ new BAP()],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    node: {
        fs: 'empty',
        path: 'empty'
    },
    module: {
        rules: [
        // Scripts
        {
            test: /\.ts$/,
            exclude: [/node_modules/, /^src\/spec-lib/, /.spec\.ts$/],
            loader: require.resolve('awesome-typescript-loader'),
            options: {
                configFileName: "tsconfig-build.json"
            },
            include: [__dirname],
        }
        ]
    }
};