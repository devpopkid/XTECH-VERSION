const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "ginfo",
    react: "🥏",
    alias: ["groupinfo"],
    desc: "Get group informations.",
    category: "group",
    use: '.ginfo',
    filename: __filename
}, async (conn, mek, m, {
    from, quoted, isGroup, sender, participants, reply, isBotAdmins, isAdmins
}) => {
    try {
        if (!isGroup) return reply("❌ This command is for groups only.");
        if (!isAdmins) return reply("❌ Only admins can use this command.");
        if (!isBotAdmins) return reply("❌ I need admin permission to access group info.");

        const metadata = await conn.groupMetadata(from);
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        const owner = metadata.owner || groupAdmins[0]?.id || "unknown";
        const profile = await conn.profilePictureUrl(from, 'image').catch(() => null);
        const image = profile || "https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png";

        const box = 
`┏━━━━━━━━━━━━━━━━━━
┃ *「 Group Info 」*
┃
┃ 🏷️ *Name:* ${metadata.subject}
┃ 🆔 *JID:* ${metadata.id}
┃ 👥 *Members:* ${metadata.size}
┃ 👑 *Owner:* @${owner.split('@')[0]}
┃ 📝 *Description:* ${metadata.desc || 'N/A'}
┃
┃ 🛡️ *Admins:*
┃ ${listAdmin}
┗━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, {
            image: { url: image },
            caption: box,
            contextInfo: {
                mentionedJid: [m.sender, owner, ...groupAdmins.map(a => a.id)],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363382023564830@newsletter",
                    newsletterName: "𝙽𝙾𝚅𝙰-𝚇𝙼𝙳",
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("ginfo error:", e);
        reply(`❌ *An error occurred while fetching group info.*`);
    }
});
