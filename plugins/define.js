const axios = require('axios');
const { cmd, commands } = require('../command');

cmd({
  pattern: "define",
  desc: "📚 Get the definition of a word",
  react: "🔍",
  category: "author",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return conn.sendMessage(from, {
        text: "*❗ Usage:* `.define [word]`\n\n_Example:_ `.define courage`",
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    }

    const word = q.trim();
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await axios.get(url);
    const result = response.data[0];

    const definition = result.meanings[0].definitions[0].definition;
    const example = result.meanings[0].definitions[0].example || 'No example available.';
    const synonymsArr = result.meanings[0].definitions[0].synonyms;
    const synonyms = synonymsArr && synonymsArr.length > 0 ? synonymsArr.join(', ') : 'No synonyms found.';

    const output = `
📖 *Definition of:* _${result.word}_

🔍 *Meaning:* ${definition}
📝 *Example:* ${example}
🔗 *Synonyms:* ${synonyms}

_Powered by 💎 *Popkid XTech* 💎_
    `.trim();

    await conn.sendMessage(from, {
      text: output,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420342566562@newsletter',
          newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);

    if (e.response && e.response.status === 404) {
      return conn.sendMessage(from, {
        text: "❌ *Word not found.*\nPlease check your spelling and try again.",
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    }

    return conn.sendMessage(from, {
      text: "⚠️ *An error occurred while fetching the definition.*\nPlease try again later.",
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420342566562@newsletter',
          newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
  }
});
