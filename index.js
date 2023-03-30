const { Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const utils = require("./utils/index.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.token);

client.on("messageCreate", async function(message) {
  if (message.author.bot) return false;
  if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return false;
  const response = await fetch('https://aoijs-api.bumblebeerox1.repl.co/api/aoijs/getFunctions?code=' + message.content);
  const fd = await response.json();


  if (fd.functions.length == 1) {
    utils.singleReply(fd, message);
  }
  else if(fd.functions.length > 1) {
    utils.multiReply(fd, message);
  }

});

client.on(Events.InteractionCreate, async function(interaction) {
  if (!interaction.isButton()) return;
  var rep = false;
  interaction.deferUpdate();
  if (interaction.customId == "next") {
    var db = JSON.parse(require("fs").readFileSync(process.cwd() + "/database/data.json"));
    for (i = 0; i < db.length; i++) {
      if (db[i].msg == interaction.message.id) {
        if (db[i].current == (db[i].funcs.length - 1)) {
          rep=true;
          return interaction.editReply({ content: "No more pages!", ephemeral: true })
        }
        let message = client.channels.fetch(interaction.channel.id)
        db[i].current += 1;
          let func = db[i].funcs[db[i].current];
          const resp = await fetch('https://aoijs-api.bumblebeerox1.repl.co/api/aoijs/function?name=' + func);
          const data = await resp.json();
          var exampleEmbed = {
            color: 0x0099ff,
            title: 'Function Usage of ' + func,

            description: `${data.desc}`,

            fields: [
              {
                name: '**Usage:**',
                value: `\`\`\`${data.usage}\`\`\``,
                inline: false,
              }, {
                name: '**Example:**',
                value: `${data.example}`,
                inline: false,
              }
            ],
            timestamp: new Date().toISOString(),
          };
          const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel('⏪ Previous: '+(db[i].funcs[db[i].current-1]||"Nothing"))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setURL(data.link)
        .setLabel('Docs!')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(data.src)
        .setLabel('Source Code!')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel('⏩ Next: '+(db[i].funcs[db[i].current+1]||"Nothing"))
        .setStyle(ButtonStyle.Primary)
    );
        interaction.channel.messages.fetch(interaction.message.id).then(function(msg) {
          require("fs").writeFileSync(process.cwd() + "/database/data.json", JSON.stringify(db));
          rep=true;
          return msg.edit({ embeds: [exampleEmbed], components: [row] })
        

  


        })

      }
    }
  }
  if (interaction.customId == "prev") {
    var db = JSON.parse(require("fs").readFileSync(process.cwd() + "/database/data.json"));
    for (i = 0; i < db.length; i++) {
      if (db[i].msg == interaction.message.id) {
        if (db[i].current == 0) {
          rep=true;
          return interaction.editReply({ content: "No previous pages!", ephemeral: true })
        }
        let message = client.channels.fetch(interaction.channel.id)
        db[i].current -= 1;
          let func = db[i].funcs[db[i].current];
          const resp = await fetch('https://aoijs-api.bumblebeerox1.repl.co/api/aoijs/function?name=' + func);
          const data = await resp.json();
          var exampleEmbed = {
            color: 0x0099ff,
            title: 'Function Usage of ' + func,

            description: `${data.desc}`,

            fields: [
              {
                name: '**Usage:**',
                value: `\`\`\`${data.usage}\`\`\``,
                inline: false,
              }, {
                name: '**Example:**',
                value: `${data.example}`,
                inline: false,
              }
            ],
            timestamp: new Date().toISOString(),
          };
          const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("prev")
        .setLabel('⏪ Previous: '+(db[i].funcs[db[i].current-1]||"Nothing"))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setURL(data.link)
        .setLabel('Docs!')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(data.src)
        .setLabel('Source Code!')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel('⏩ Next: '+(db[i].funcs[db[i].current+1]||"Nothing"))
        .setStyle(ButtonStyle.Primary)
    );
        interaction.channel.messages.fetch(interaction.message.id).then(function(msg) {
          require("fs").writeFileSync(process.cwd() + "/database/data.json", JSON.stringify(db));
          rep=true;
          return msg.edit({ embeds: [exampleEmbed], components: [row] })
        
  


        })

      }
    }
  }
  /*if(rep==true)return;
  else{
    interaction.reply({ content: "Error", ephemeral: true })

  }*/
});
