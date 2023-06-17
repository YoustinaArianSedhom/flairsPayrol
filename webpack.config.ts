module.exports = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        ident: 'postcss',
                        syntax: 'postcss-scss',
                        plugins: [
                            ['postcss-import', {path: ['./src/assets/style/']}],
                            require('tailwindcss'),
                            require('autoprefixer'),
                        ],
                        
                    },
                },
            },
        ],
    },
};