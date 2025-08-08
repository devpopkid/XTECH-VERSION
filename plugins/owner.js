const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅",
    desc: "Show bot owner's contact info",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const number = config.OWNER_NUMBER?.replace('+', '');
        const name = config.OWNER_NAME || 'Popkid';

        if (!number) return reply("❌ Owner number missing in settings.");

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;waid=${number}:${number}
END:VCARD`;

        await conn.sendMessage(from, {
            contacts: {
                displayName: name,
                contacts: [{ vcard }]
            }
        });

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/e6rhto.jpg' },
            caption: `👑 *Owner:* ${name}\n📞 wa.me/${number}\n⚙️ Powered by Popkid XTech`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420342566562@newsletter',
                    newsletterName: 'Pᴏᴘᴋɪᴅ Xᴛᴇᴄʜ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/x9g2rd.m4a' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Failed to send owner info.");
    }
});
