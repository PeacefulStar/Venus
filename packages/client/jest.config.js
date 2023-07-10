module.exports = {
    name: 'client',
    displayName: 'client',
    verbose: true,
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {cwd: __dirname}],
    },
    moduleNameMapper: {
        '.(css|scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|pdf)$':
            '<rootDir>/.jest/stub.js',
    },
};
