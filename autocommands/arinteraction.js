const { Events, AttachmentBuilder,ActionRowBuilder,ButtonBuilder, ButtonStyle  } = require('discord.js');
const fs = require("fs")
const path = require("path")


module.exports = {
  code: async (client, bot) => {

    client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isStringSelectMenu()) return;

      if (interaction.customId === 'select') {
        var func = bot.functionManager.cache.get(interaction.values[0])
        if (!func) return await interaction.reply("Cannot find function `" + interaction.values[0] + "`!")
        const code = func.code.toString()
        const response = await fetch('https://aoijs-api.bumblebeerox1.repl.co/api/aoijs/function?name='+interaction.values[0]);
        const data = await response.json();

        var fcode = "";
        if (code.length >= 1024) {
          fcode = "File is too big to send in embed!"
        }
        else {
          fcode = code
        }


        var exampleEmbed = {
          color: 0x0099ff,
          title: 'Function Usage of $'+interaction.values[0],

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
          await interaction.reply({ embeds: [exampleEmbed], ephemeral: true ,components: [row]});
        }
        else {
          fs.appendFile(__dirname.replace("/autocommands", "") + "/data/" + interaction.values[0].replace("$", "") + ".js", code, function(err) {
            if (err) throw err;
            console.log('Saved!');
          });

          const attachment = new AttachmentBuilder(__dirname.replace("/autocommands", "") + "/data/" + interaction.values[0].replace("$", "") + ".js", { name: interaction.values[0].replace("$", "") + '.js' })

          await interaction.reply({ embeds: [exampleEmbed], ephemeral: true, files: [attachment],components: [row] });

        }

      }
    })
  }
}
