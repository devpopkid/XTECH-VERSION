const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async(conn, mek, m, {
    from, q, isGroup, isAdmins, isBotAdmins, botNumber, reply, sender
}) => {

    const newsletterInfo = {
        newsletterJid: '120363420342566562@newsletter',
        newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
        serverMessageId: 143
    };

    if (!isGroup) return reply("🚫 *This command only works in group chats.*");
    if (!isAdmins) return reply("👮 *Only group admins can use this command.*");
    if (!isBotAdmins) return reply("🤖 *I need admin rights to demote someone.*");

    let number;

    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s+]/g, '');
    } else {
        return reply("⚠️ *Please tag or reply to the user you want to demote.*\n\nExample: `.demote @user`");
    }

    if (number === botNumber.replace(/[^0-9]/g, '')) return reply("🤖 *I can't demote myself!*");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");

        await conn.sendMessage(
            from,
            {
                text: `⬇️ *Demotion Successful!*\n\n@${number} has been removed from admin.`,
                contextInfo: {
                    mentionedJid: [jid, sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: newsletterInfo
                }
            },
            { quoted: mek }
        );
    } catch (e) {
        console.error("Demote error:", e);
        reply("❌ *Failed to demote the user.*\nMake sure the number is valid and in the group.");
    }
});
