const { cmd } = require('../command');

cmd({
    pattern: "add",
    alias: ["a", "invite"],
    desc: "Adds a member to the group",
    category: "admin",
    react: "➕",
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
    } else if (q && /^\d+$/.test(q)) {
        number = q;
    } else {
        return reply("❌ Please reply to a message, mention a user, or provide a number to add.");
    }

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "add");

        const box = `┏━━━━━━━━━━━━━━━━━━
┃ ✅ *Member Added*
┃ 👤 *User:* @${number}
┃ 🏷️ *Action:* Added to group
┗━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, {
            text: box,
            mentions: [jid],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [jid],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363382023564830@newsletter",
                    newsletterName: "𝙽𝙾𝚅𝙰-𝚇𝙼𝙳",
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Add command error:", error);
        reply("❌ Failed to add the member.");
    }
});
