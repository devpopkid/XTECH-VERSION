const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const { getGroupAdmins } = require('../lib/functions2');

cmd({
    pattern: "invite",
    alias: ["glink", "grouplink"],
    desc: "Get group invite link.",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, sender, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        const botNumber = conn.user.id.split(':')[0] + "@s.whatsapp.net";
        const senderNumber = sender;

        const metadata = await conn.groupMetadata(from);
        const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
        const isBotAdmin = admins.includes(botNumber);
        const isSenderAdmin = admins.includes(senderNumber);

        if (!isBotAdmin) return reply("❌ I need to be an admin to get the group invite link.");
        if (!isSenderAdmin) return reply("❌ Only group admins can use this command.");

        const inviteCode = await conn.groupInviteCode(from);
        if (!inviteCode) return reply("❌ Failed to generate group invite link.");

        const groupName = metadata.subject || "Group";
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        const box = `┏━━━━━━━━━━━━━━━━━━
┃ 📩 *Group Invite Link*
┃ 📛 *Group:* ${groupName}
┃ 🔗 *Link:* ${inviteLink}
┗━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, {
            text: box,
            mentions: [m.sender],
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [m.sender],
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363420342566562@newsletter",
                    newsletterName: "popkid",
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in invite command:", error);
        reply("⚠️ An error occurred while generating the invite link.");
    }
});
