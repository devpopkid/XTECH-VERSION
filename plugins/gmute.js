const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "🔓",
    desc: "Unlock the group (Allows new members to join).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        const jid = m.sender;

        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins) return reply("❌ Only group admins can use this command.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to unlock the group.");

        await conn.groupSettingUpdate(from, "unlocked");

        await conn.sendMessage(from, {
            text: `┏━━━━━━━━━━━━━━━━━━
┃ ✅ *Group Unlocked*
┃ 👤 *By:* ${jid}
┃ 🔓 *New members can now join*
┗━━━━━━━━━━━━━━━━━`,
            contextInfo: {
                mentionedJid: [jid],
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
        console.error("Error unlocking group:", e);
        reply("❌ Failed to unlock the group. Please try again.");
    }
});
