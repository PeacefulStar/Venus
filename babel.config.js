module.exports = (api) => {
    console.log(api);
    // This caches the Babel config
    api.cache.using(() => process.env.NODE_ENV);
    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage',
                    corejs: 3,
                    targets: {
                        node: 'current',
                        esmodules: true,
                    },
                },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-jsx',
            '@babel/plugin-transform-modules-commonjs',
            '@babel/plugin-transform-parameters',
            '@babel/plugin-transform-react-constant-elements',
            '@babel/plugin-transform-react-inline-elements',
            '@babel/plugin-transform-template-literals',
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: 3,
                },
            ],
        ],
        // Applies the react-refresh Babel plugin on non-production modes only
        ...(!api.env('production') && {plugins: ['react-refresh/babel']}),
    };
};
