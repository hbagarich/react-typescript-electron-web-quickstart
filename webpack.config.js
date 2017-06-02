'use strict';

const path = require('path');
const rules = require('./webpack/rules');
const plugins = require('./webpack/plugins');
const objectAssign = require('object-assign');

const applicationEntries = process.env.NODE_ENV === 'development'
    ? []
    : [];

const publicPathValue = process.env.NODE_ENV === 'development' ? '/' : './';


const baseExternals= {
        'react/lib/ReactContext': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/addons': true,        
    }

const electronTargetExternals = baseExternals;
const webExternals = objectAssign({}, baseExternals, {electron: true});

module.exports = {
    entry: ['./src/index.tsx'].concat(applicationEntries),
    context: __dirname,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: publicPathValue,
        sourceMapFilename: '[name].js.map'
    },

    devtool: process.NODE_ENV == 'production'
        ? 'source-map'
        : 'source-map',

    resolve: {
        extensions: [
            '.webpack.js',
            '.web.js',
            '.tsx',
            '.ts',
            '.js',
            '.json'
        ],
        alias: {
            react: path.resolve('./node_modules/react')            
        }
        
    },

    plugins: plugins,

    devServer: {
        historyApiFallback: {
            index: '/'
        }
    },

    module: {
        rules: [
            rules.tslint,
            rules.ts,            
            rules.html,
            rules.css,
            rules.svg,
            rules.eot,
            rules.woff,
            rules.woff2,
            rules.ttf,
            rules.png
        ]
    },
    target: process.NODE_ENV == 'production' ? 'electron-renderer' : undefined,
    externals: process.NODE_ENV == 'production' ? electronTargetExternals : webExternals,
}