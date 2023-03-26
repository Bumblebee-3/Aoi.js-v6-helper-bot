const {  ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder,ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require("fs")
const path = require("path")


module.exports = {
  code: async (message, bot) => {
    if (message.content.startsWith("$") || (message.content.includes("\`\`\`") && message.content.includes("$"))) {
      var s1 = 0;
      var s2 = 0;
      var s3 = 0;
      var s4 = 0;
      var s5 = 0;
      var s6 = 0;
      for (i in message.content.split("")) {
        if (message.content.split("")[i] == "]") {
          s2 += 1
        }
        else if (message.content.split("")[i] == "[") {
          s1 += 1
        }
        else if (message.content.split("")[i] == "}") {
          s4 += 1
        }
        else if (message.content.split("")[i] == "{") {
          s3 += 1
        }
        else if (message.content.split("")[i] == ")") {
          s6 += 1
        }
        else if (message.content.split("")[i] == "(") {
          s5 += 1
        }
      }
      if (s1 != s2 || s3 != s4 || s5 != s6) {
        return message.channel.send("Brackets are not proper!")
      }
      var f = bot.functionManager.findFunctions(message.content.replace(/\`\`\`/g, ""))
      if (f.length >= 2) {
        //console.log(f)
        var mstring = "";
        var custom_options = [];
        for (let i = 0; i < f.length; i++) {
          if (mstring.includes(f[i])==true) continue;
          else {
            mstring = mstring + f[i] + "\n"
            custom_options[i] = {
              label: `${f[i]}`,
              description: `Get Usage of ${f[i]}`,
              value: `${f[i].replace("$", "")}`,
            }
          }
        }
        const exampleEmbed = {
          color: 0x0099ff,
          title: "Multiple Functions Found!",

          description: `Multiple Functions Were found in your input!`,

          fields: [
            {
              name: '**Functions List:**',
              value: `\`\`\`${mstring}\`\`\``,
              inline: false,
            }

          ],
          timestamp: new Date().toISOString(),
        };

        const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('select')
              .setPlaceholder('Select a function')
              .addOptions(custom_options),
          );
        message.reply({ embeds: [exampleEmbed], components: [row] });

      }
      else {
        if (!f[0]) return message.channel.send("Cannot find function `" + message.content + "`!")
        var func = bot.functionManager.cache.get(f[0].replace("$", ""))
        if (!func) return message.channel.send("Cannot find function `" + f[0] + "`!")
        const code = func.code.toString()
        var fcode = "";
        if (code.length >= 1024) {
          fcode = "File is too big to send in embed!"
        }
        else {
          fcode = code
        }
        const response = await fetch('https://aoijs-api.bumblebeerox1.repl.co/api/aoijs/function?name='+f[0]);
        const data = await response.json();


        var exampleEmbed = {
          color: 0x0099ff,
          title: 'Function Usage of '+f[0],

          description: `${data.desc}`,

          fields: [
            {
              name: '**Usage:**',
              value: `\`\`\`${data.usage}\`\`\``,
              inline: false,
            },
            {
              name: '**Code:**',
              value: `\`\`\`js\n${fcode}\n\`\`\``,
              inline: false,
            },{
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
					.setURL(data.link)
					.setLabel('Docs!')
					.setStyle(ButtonStyle.Link),
        new ButtonBuilder()
					.setURL(data.src)
					.setLabel('Source Code!')
					.setStyle(ButtonStyle.Link)
			);
        if (fcode == code) {
          message.reply({ embeds: [exampleEmbed],components: [row] });
        }
        else {
          fs.appendFile(__dirname.replace("/autocommands", "") + "/data/" + f[0].replace("$", "") + ".js", code, function(err) {
            if (err) throw err;
            console.log('Saved!');
          });

          const attachment = new AttachmentBuilder(__dirname.replace("/autocommands", "") + "/data/" + f[0].replace("$", "") + ".js", { name: f[0].replace("$", "") + '.js' })
          message.reply({ embeds: [exampleEmbed],components: [row] });
          message.channel.send({ files: [attachment] })
        }

      }

    }
  }
}