const config = require('../config');
const { cmd, commands } = require('../command');
const { isUrl } = require('../lib/functions');

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join <group link>',
    filename: __filename
}, async (conn, mek, m, {
    from, quoted, q, isCreator, reply
}) => {
    try {
        const msr = {
            own_cmd: "❌ *Only my creator can use this command.*"
        };

        if (!isCreator) return reply(msr.own_cmd);

        if (!q && !quoted) return reply("📎 *Please provide a valid WhatsApp group link.*");

        let groupLink;

        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) return reply("❌ *Invalid Group Link.*");

        await conn.groupAcceptInvite(groupLink);

        const box =
`┏━━━━━━━━━━━━━━━━━━
┃ ✅ *Successfully Joined Group!*
┃ 👤 *Requested by:* @${m.sender.split("@")[0]}
┃ 🔗 *Invite Code:* ${groupLink}
┗━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, {
            text: box,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363420342566562@newsletter",
                    newsletterName: "popkid",
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Join Command Error:", e);
        reply(`❌ *An error occurred while trying to join the group.*\n\n${e.message}`);
    }
});
