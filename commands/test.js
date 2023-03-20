module.exports = {
  name: "help",
  code: async (message) => {
    message.channel.send("Hey there! This is an aoi.js helper bot coded in discord.js. You can input any code of aoi.js and I will give you usage of functions and other useful information. for example, type `$interactionReply`")
  },
  nonPrefixed: false
}