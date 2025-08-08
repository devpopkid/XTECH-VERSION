const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "bible",
  desc: "Get a Bible verse by reference",
  category: "fun",
  react: "📖",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (!args.length) {
      return reply("❗ *Please provide a Bible reference.*\n\n📘 Example: `.bible John 3:16`");
    }

    const reference = args.join(" ");
    const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}`;
    const { data } = await axios.get(apiUrl);

    if (data.error) {
      return reply(`❌ *Error:* ${data.error}`);
    }

    const verse = data.text.trim();
    const ref = data.reference || reference;
    const version = data.translation_name || "Unknown";

    // Build stylish text
    const msg = `📖 *${ref}*\n\n${verse}\n\n🔸 *${version}*\n\n✨ _Popkid Bible ✝️_`;

    // Send with fake newsletter style
    await conn.sendMessage(m.chat, {
      text: msg,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420342566562@newsletter',
          newsletterName: 'Pᴏᴘᴋɪᴅ 𝐁𝐢𝐛𝐥𝐞 ✝️',
          serverMessageId: 77
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("Bible Error:", e);
    reply("⚠️ *Something went wrong. Please try again.*");
  }
});
