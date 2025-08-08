const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "k"],
    desc: "Removes a member from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, senderNumber
}) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return reply("❌ Only the bot owner can use this command.");
    }

    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else {
        return reply("❌ Please reply to a message or mention a user to remove.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");

        const box =
`┏━━━━━━━━━━━━━━━━━━
┃ ❌ *Member Removed!*
┃ 👤 *Target:* @${number}
┃ 🔧 *By Owner:* @${m.sender.split("@")[0]}
┗━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, {
            text: box,
            mentions: [jid, m.sender],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [jid, m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363420342566562@newsletter",
                    newsletterName: "popkid",
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Remove command error:", error);
        reply("❌ Failed to remove the member.");
    }
});
