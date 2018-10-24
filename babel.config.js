module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "6" }
      }
    ]
  ],
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: { node: "current" }
          }
        ]
      ],
      plugins: [
        [
          "module-resolver",
          {
            alias: {
              richtypo: "./src/richtypo.js"
            }
          }
        ]
      ]
    }
  }
};
