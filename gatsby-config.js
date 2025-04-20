require('dotenv').config({
  path: `${process.cwd()}/.env`,
})
console.log("Config: Loading env from:", `${process.cwd()}/.env`)
console.log("Config: GitHub token:", process.env.GATSBY_GITHUB_TOKEN ? "Found" : "Not found")

module.exports = {
  siteMetadata: {
    description: "Giulio's Personal Page",
    locale: "en",
    title: "Giulio De Pasquale",
  },
  plugins: [
    {
      resolve: "@peperunas/gatsby-theme-intro",
      options: {
        basePath: "/",
        contentPath: "content/",
        showThemeLogo: false,
        theme: "gh-inspired",
      },
    },
  ],
}
