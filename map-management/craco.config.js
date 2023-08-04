module.exports = {
  module: {
    rules: [
      {
        test: /\.laz$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};
