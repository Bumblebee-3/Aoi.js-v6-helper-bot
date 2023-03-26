
const fs = require("fs");
const path = require("path");
const { Client, Events, GatewayIntentBits } = require('discord.js');
const prefix = require("./config.json").prefix || "bee ";
const token = process.env.token || require("./config.json").token;
const handler = require("./handler/main.js");
const bot = handler.handleCode();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
try {
  fs.unlinkSync(__dirname + "/data/a.json");

  console.log("Delete File successfully.");
} catch (error) {
  console.log(error);
}

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);


client.on("messageCreate", (message) => {
  if (message.author.bot) return false;

  if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return false;
  require("./autocommands/autoresponder.js").code(message, bot)
  var files = fs.readdirSync('./commands/');
  for (var i = 0; i < files.length; i++) {
    var data = require(`./commands/${files[i]}`);
    if (data.nonPrefixed == true) {
      if (message.content.startsWith(data.name) == true) {
        return data.code(message, prefix);
      }
    }
    else {
      if (message.content.startsWith(prefix + data.name) == true) {
        return data.code(message, prefix);
      }
    }
  }

});
require("./autocommands/arinteraction.js").code(client, bot)


client.once(Events.ClientReady, () => {
  console.log('Ready!');
});


try {
  function* walkSync(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        yield* walkSync(path.join(dir, file.name));
      } else {
        yield path.join(dir, file.name);
      }
    }
  }

  let ff = []
  for (const filePath of walkSync(path.join(__dirname, "/node_modules/aoi.js/src/functions/Funcs/"))) {
    ff.push(filePath);
  }
  var array = []
  var awaited = []
  var calling = []
  var events = []
  var info = []
  var misc = []
  var util = []
  for (const rr of ff) {
    let pathh = rr.replace(process.cwd(), "").replace("node_modules/aoi.js/src/functions/Funcs/", "").replace(".js", "")//.replace(/\//g, "%2F")
    if (pathh.includes("/awaited/")) {
      awaited.push(pathh.replace("/awaited/", ""))
      array.push({ "func": pathh.replace("/awaited/", ""), "type": "awaited" })
    }
    if (pathh.includes("/calling/")) {
      calling.push(pathh.replace("/calling/", ""))
      array.push({ "func": pathh.replace("/calling/", ""), "type": "calling" })
    }
    if (pathh.includes("/events/")) {
      events.push(pathh.replace("/events/", ""))
      array.push({ "func": pathh.replace("/events/", ""), "type": "events" })
    }
    if (pathh.includes("/info/")) {
      info.push(pathh.replace("/info/", ""))
      array.push({ "func": pathh.replace("/info/", ""), "type": "info" })
    }
    if (pathh.includes("/misc/")) {
      misc.push(pathh.replace("/misc/", ""))
      array.push({ "func": pathh.replace("/misc/", ""), "type": "misc" })
    }
    if (pathh.includes("/util/")) {
      util.push(pathh.replace("/util/", ""))
      array.push({ "func": pathh.replace("/util/", ""), "type": "util" })
    }



  }
  fs.appendFile(__dirname + "/data/" + "funcs" + ".json", JSON.stringify({ "util": util, "misc": misc, "info": info, "events": events, "calling": calling, "awaited": awaited }), function(err) {
    if (err) throw err;
    console.log('Saved!');
  });


  fs.appendFile(__dirname + "/data/" + "a" + ".json", JSON.stringify(array), function(err) {
    if (err) throw err;
    console.log('Saved!');
  });


} catch (e) {
  console.log("invalid path/error occoured!")
}

module.exports = { client }