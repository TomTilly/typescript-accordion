module.exports = (ctx) => {
  // console.log('ctx', ctx);
  return {
    parser: "postcss-scss",
    plugins: {
      autoprefixer: {}
    }
  };
};