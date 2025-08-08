const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const { getAnti, setAnti, initializeAntiDeleteconfig } = require('../data/antidel');

// Initialize AntiDelete config
initializeAntiDeleteconfig();

// ─── AntiDelete Command ─────────────────────────────
cmd({
  pattern: "antidelete",
  alias: ['antidel', 'ad'],
  desc: "Sets up the Antidelete feature.",
  category: "misc",
  filename: __filename
},
async (conn, mek, m, { from, reply, q, isCreator }) => {
  if (!isCreator) return reply('⚠️ This command is only for the bot owner. ⚠️');

  try {
    const command = q?.toLowerCase();

    switch (command) {
      case 'on':
        await setAnti('gc', true);
        await setAnti('dm', true);
        return reply('✅ _AntiDelete has been ENABLED for Group Chats and Direct Messages._');

      case 'off gc':
        await setAnti('gc', false);
        return reply('❌ _AntiDelete for Group Chats is now DISABLED._');

      case 'off dm':
        await setAnti('dm', false);
        return reply('❌ _AntiDelete for Direct Messages is now DISABLED._');

      case 'set gc':
        const gcStatus = await getAnti('gc');
        await setAnti('gc', !gcStatus);
        return reply(`🔁 _AntiDelete for Group Chats is now ${!gcStatus ? 'ENABLED' : 'DISABLED'}._`);

      case 'set dm':
        const dmStatus = await getAnti('dm');
        await setAnti('dm', !dmStatus);
        return reply(`🔁 _AntiDelete for Direct Messages is now ${!dmStatus ? 'ENABLED' : 'DISABLED'}._`);

      case 'set all':
        await setAnti('gc', true);
        await setAnti('dm', true);
        return reply('✅ _AntiDelete has been ENABLED for all chats._');

      case 'status':
        const currentGc = await getAnti('gc');
        const currentDm = await getAnti('dm');
        return reply(`🔍 _AntiDelete Status:_\n\n*DM AntiDelete:* ${currentDm ? '✅ ENABLED' : '❌ DISABLED'}\n*Group Chat AntiDelete:* ${currentGc ? '✅ ENABLED' : '❌ DISABLED'}`);

      default:
        return reply(`╭───〔 *🛡️ ANTIDELETE HELP* 〕───⬣
│
│ 🔘 \`\`.antidelete on\`\` - Enable for all
│ ❌ \`\`.antidelete off gc\`\` - Disable in groups
│ ❌ \`\`.antidelete off dm\`\` - Disable in DMs
│ 🔄 \`\`.antidelete set gc\`\` - Toggle for GCs
│ 🔄 \`\`.antidelete set dm\`\` - Toggle for DMs
│ ✅ \`\`.antidelete set all\`\` - Enable everywhere
│ 📊 \`\`.antidelete status\`\` - Show status
│
╰━━━━━━━━━━━━━━━━━━━━⬣`);
    }
  } catch (e) {
    console.error("⚠️ Error in antidelete command:", e);
    return reply("❌ An error occurred while processing your request.");
  }
});

// ─── AntiDelete Recovery Handler ─────────────────────
cmd({
  on: "messages.delete",
  filename: __filename
},
async (conn, msg) => {
  try {
    if (!msg || !msg.key || !msg.message) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const anti = await getAnti(isGroup ? 'gc' : 'dm');
    if (!anti) return;

    const type = Object.keys(msg.message)[0];
    const sender = msg.pushName || 'Unknown';
    const botJid = conn?.user?.id || from;

    const info = `🗑️ *Deleted Message Recovered*
👤 From: ${sender}
💬 Type: ${type}`;

    await conn.sendMessage(botJid, msg.message, { quoted: msg });
    await conn.sendMessage(botJid, { text: info }, { quoted: msg });

  } catch (err) {
    console.log("❌ AntiDelete recovery error:", err);
  }
});

// ─── ViewOnce Retrieval (vv3) ────────────────────────
cmd({
  pattern: "vv3",
  alias: ['retrive', '🔥'],
  desc: "Fetch and resend a ViewOnce message content (image/video/audio).",
  category: "misc",
  use: '<query>',
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const quotedMessage = m.msg.contextInfo?.quotedMessage;

    if (quotedMessage && quotedMessage.viewOnceMessageV2) {
      const quot = quotedMessage.viewOnceMessageV2;

      if (quot.message.imageMessage) {
        let caption = quot.message.imageMessage.caption || '';
        let media = await conn.downloadAndSaveMediaMessage(quot.message.imageMessage);
        return conn.sendMessage(from, { image: { url: media }, caption }, { quoted: mek });
      }

      if (quot.message.videoMessage) {
        let caption = quot.message.videoMessage.caption || '';
        let media = await conn.downloadAndSaveMediaMessage(quot.message.videoMessage);
        return conn.sendMessage(from, { video: { url: media }, caption }, { quoted: mek });
      }

      if (quot.message.audioMessage) {
        let media = await conn.downloadAndSaveMediaMessage(quot.message.audioMessage);
        return conn.sendMessage(from, { audio: { url: media } }, { quoted: mek });
      }
    }

    if (!m.quoted) return reply("⚠️ Please reply to a ViewOnce message.");

    if (m.quoted.mtype === "viewOnceMessage") {
      if (m.quoted.message.imageMessage) {
        let caption = m.quoted.message.imageMessage.caption || '';
        let media = await conn.downloadAndSaveMediaMessage(m.quoted.message.imageMessage);
        return conn.sendMessage(from, { image: { url: media }, caption }, { quoted: mek });
      } else if (m.quoted.message.videoMessage) {
        let caption = m.quoted.message.videoMessage.caption || '';
        let media = await conn.downloadAndSaveMediaMessage(m.quoted.message.videoMessage);
        return conn.sendMessage(from, { video: { url: media }, caption }, { quoted: mek });
      } else if (m.quoted.message.audioMessage) {
        let media = await conn.downloadAndSaveMediaMessage(m.quoted.message.audioMessage);
        return conn.sendMessage(from, { audio: { url: media } }, { quoted: mek });
      }
    } else {
      return reply("❌ This is not a valid ViewOnce message.");
    }
  } catch (e) {
    console.log("⚠️ Error in vv3:", e);
    reply("❌ An error occurred while fetching the ViewOnce message.");
  }
});

// Credit: Popkid Dev 💡 | github.com/devpopkid
