const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    plugin(({ addVariant }) => {
      addVariant("selected", ".selected &");
      addVariant("group-item-hover", ".group-item:hover &");
    }),
  ],
};
