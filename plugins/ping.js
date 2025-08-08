const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = Date.now();

        const reactionEmojis = ['⚡', '🚀', '🔥', '💨', '🌟'];
        const statusEmojis = ['✅', '🟢', '✨', '📶', '🔋'];

        const pingMessage = await conn.sendMessage(from, {
            text: '*〘⏳ Checking bot speed... 〙*'
        });

        const end = Date.now();
        const speed = end - start;

        let status = "Stable";
        if (speed > 1000) status = "Slow";
        else if (speed > 500) status = "Moderate";

        const stylishText = `
╭─❏ *『 𝙱𝙾𝚃 𝚂𝚃𝙰𝚃𝚄𝚂 』*
│
├─⚡ *Bot Name:*  ${config.botname || 'POPKID-XTECH'}
├─🚀 *Speed:* ${speed}ms
├─📶 *Status:* ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} ${status}
├─🕐 *Checked At:* ${new Date().toLocaleTimeString()}
│
╰─❏ *Powered by popkid💻*
        `.trim();

        await conn.sendMessage(from, {
            text: stylishText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420342566562@newsletter', // ✅ Your Newsletter ID
                    newsletterName: "PᴏᴘᴋɪᴅXᴛᴇᴄʜ",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`❌ An error occurred:\n${e.message}`);
    }
});
