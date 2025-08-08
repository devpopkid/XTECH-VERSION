const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
  pattern: "hidetag",
  react: "🔊",
  desc: "Tag all group members with a message",
  category: "group",
  use: ".hidetag Your message here",
  filename: __filename
},
async (conn, mek, m, {
  from, quoted, q, isGroup, sender,
  isBotAdmins, isDev, isAdmins, participants, reply
}) => {
  try {
    const msr = (await fetchJson('https://raw.githubusercontent.com/devpopkid/POPKID-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;

    if (!isGroup) return reply(msr.only_gp);
    if (!isAdmins && !isDev) return reply(msr.you_adm);
    if (!isBotAdmins) return reply(msr.give_adm);
    if (!q) return reply("🔔 *Please provide a message to send with tag.*\n\nExample: `.hidetag Hello all`");

    // Compose the tagged message
    const text = `📣 *Message from Admin:*\n\n${q}`;

    // Send with newsletter style
    await conn.sendMessage(from, {
      text: text,
      mentions: participants.map(p => p.id),
      contextInfo: {
        mentionedJid: participants.map(p => p.id),
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
    console.error('Hidetag error:', e);
    await conn.sendMessage(from, {
      react: { text: '❌', key: mek.key }
    });
    reply(`❌ *An error occurred!*\n\n\`\`\`${e.message || e}\`\`\``);
  }
});
