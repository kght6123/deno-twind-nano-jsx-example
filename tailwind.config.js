module.exports = {
  content: [
    "./client.tsx",
    "./server.tsx",
    "./nanossr.ts",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: require("daisyui/colors"),
    },
  },
  plugins: [require("daisyui")],
};
