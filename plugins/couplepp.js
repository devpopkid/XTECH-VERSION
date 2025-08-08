const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
  pattern: "couplepp",
  alias: ["couple", "cpp"],
  react: "💑",
  desc: "Get a male and female couple profile picture.",
  category: "image",
  use: ".couplepp",
  filename: __filename
}, async (_0x552520, _0x51cf3f, _0x29f4cb, { from: _0x556c44, args: _0x2e3a6d, reply: _0x30d3fc }) => {
  try {
    await _0x30d3fc("*💑 Popkid is fetching perfect couple profile pics...*\n\nPlease wait...");

    const res = await axios.get("https://api.davidcyriltech.my.id/couplepp");
    if (!res.data || !res.data.success) {
      return _0x30d3fc("❌ Failed to fetch couple profile pictures.\nPlease try again later.");
    }

    const malePP = res.data.male;
    const femalePP = res.data.female;

    const contextInfo = {
      mentionedJid: [_0x51cf3f.sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363420342566562@newsletter',
        newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
        serverMessageId: 143
      }
    };

    if (malePP) {
      await _0x552520.sendMessage(_0x556c44, {
        image: { url: malePP },
        caption: `👨 *Male Profile Picture*\nFrom Popkid XTech 💖`,
        contextInfo
      }, { quoted: _0x51cf3f });
    }

    if (femalePP) {
      await _0x552520.sendMessage(_0x556c44, {
        image: { url: femalePP },
        caption: `👩 *Female Profile Picture*\nPerfect Match from XTech 💞`,
        contextInfo
      }, { quoted: _0x51cf3f });
    }

  } catch (err) {
    console.error(err);
    _0x30d3fc("❌ An error occurred while fetching couple profile pictures.\nPlease try again later.");
  }
});
