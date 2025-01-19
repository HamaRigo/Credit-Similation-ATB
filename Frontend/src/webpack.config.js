module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
                exclude: [/node_modules/], // Prevent source-map-loader from processing node_modules

            },
        ],
    },
};