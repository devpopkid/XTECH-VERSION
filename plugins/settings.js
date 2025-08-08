const config = require('../config');
const { cmd } = require('../command');

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings"],
    desc: "Show all bot settingsuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("🚫 *Owner Only Command!*");

        let envconfig = `
*✨ 𝗣𝗢𝗣𝗞𝗜𝗗 𝗕𝗢𝗧 𝗖𝗢𝗡𝗙𝗜𝗚 ⚙️*

╭─────⭓ 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
│ 🔹 *Name:* ${config.BOT_NAME}
│ 🔹 *Prefix:* ${config.PREFIX}
│ 🔹 *Owner:* ${config.OWNER_NAME}
│ 🔹 *Number:* ${config.OWNER_NUMBER}
│ 🔹 *Mode:* ${config.MODE.toUpperCase()}
╰─────────────────────

╭─────⭓ 𝗖𝗢𝗥𝗘 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦
│ ✅ Public Mode: ${isEnabled(config.PUBLIC_MODE) ? "ON" : "OFF"}
│ 🔄 Always Online: ${isEnabled(config.ALWAYS_ONLINE) ? "ON" : "OFF"}
│ 👁 Read Msgs: ${isEnabled(config.READ_MESSAGE) ? "ON" : "OFF"}
│ 💬 Read Cmds: ${isEnabled(config.READ_CMD) ? "ON" : "OFF"}
╰─────────────────────

╭─────⭓ 𝗔𝗨𝗧𝗢𝗠𝗔𝗧𝗜𝗢𝗡
│ 🤖 Auto Reply: ${isEnabled(config.AUTO_REPLY) ? "ON" : "OFF"}
│ ❤️ Auto React: ${isEnabled(config.AUTO_REACT) ? "ON" : "OFF"}
│ ✨ Custom React: ${isEnabled(config.CUSTOM_REACT) ? "ON" : "OFF"}
│ 😜 React Emojis: ${config.CUSTOM_REACT_EMOJIS}
│ 🖼 Auto Sticker: ${isEnabled(config.AUTO_STICKER) ? "ON" : "OFF"}
│ 🎙 Auto Voice: ${isEnabled(config.AUTO_VOICE) ? "ON" : "OFF"}
╰─────────────────────

╭─────⭓ 𝗦𝗧𝗔𝗧𝗨𝗦 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦
│ 👀 Seen: ${isEnabled(config.AUTO_STATUS_SEEN) ? "ON" : "OFF"}
│ 💬 Reply: ${isEnabled(config.AUTO_STATUS_REPLY) ? "ON" : "OFF"}
│ ❤️ React: ${isEnabled(config.AUTO_STATUS_REACT) ? "ON" : "OFF"}
│ 📝 Status Msg: ${config.AUTO_STATUS_MSG}
╰─────────────────────

╭─────⭓ 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬
│ 🔗 Anti-Link: ${isEnabled(config.ANTI_LINK) ? "ON" : "OFF"}
│ 🗯 Anti-Badwords: ${isEnabled(config.ANTI_BAD) ? "ON" : "OFF"}
│ 🚫 Anti-VV: ${isEnabled(config.ANTI_VV) ? "ON" : "OFF"}
│ 🧹 Delete Links: ${isEnabled(config.DELETE_LINKS) ? "ON" : "OFF"}
╰─────────────────────

╭─────⭓ 𝗠𝗘𝗗𝗜𝗔
│ 📸 Alive Img: ${config.ALIVE_IMG}
│ 🖼 Menu Img: ${config.MENU_IMAGE_URL}
│ 💬 Alive Msg: ${config.LIVE_MSG}
│ 🧩 Sticker Pack: ${config.STICKER_NAME}
╰─────────────────────

╭─────⭓ 𝗠𝗜𝗦𝗖
│ 💬 Typing: ${isEnabled(config.AUTO_TYPING) ? "ON" : "OFF"}
│ 🔴 Recording: ${isEnabled(config.AUTO_RECORDING) ? "ON" : "OFF"}
│ 📂 Anti-Del Path: ${config.ANTI_DEL_PATH}
│ 👨‍💻 Dev: ${config.DEV}
╰─────────────────────

*📛 ${config.DESCRIPTION || 'Popkid’s custom WhatsApp bot.'}*
        `.trim();

        // Send ENV config with newsletter-style context
        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: envconfig,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420342566562@newsletter',
                        newsletterName: "PᴏᴘᴋɪᴅXᴛᴇᴄʜ",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        // Send matching voice note (style it however you like)
        await conn.sendMessage(
            from,
            {
                audio: { url: 'https://files.catbox.moe/kxdej4.m4a' },
                mimetype: 'audio/mp4',
                ptt: true,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420342566562@newsletter',
                        newsletterName: "PᴏᴘᴋɪᴅXᴛᴇᴄʜ",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ *Error:* ${error.message}`);
    }
});
