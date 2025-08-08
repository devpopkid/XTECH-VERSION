const { sleep } = require('../lib/functions');
const config = require('../config');
const { cmd } = require('../command');

// POPKID XTECH PLUGIN

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Make the bot leave the group",
    react: "👋",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, isGroup, senderNumber, reply
}) => {
    try {
        const newsletterInfo = {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
            serverMessageId: 143
        };

        if (!isGroup) {
            return reply("❌ *This command only works in group chats.*");
        }

        const botOwner = conn.user.id.split(":")[0].replace(/[^0-9]/g, '');
        if (senderNumber !== botOwner) {
            return reply("🚫 *Only the bot owner can use this command.*");
        }

        await conn.sendMessage(from, {
            text: `👋 *Leaving this group...*`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: newsletterInfo
            }
        }, { quoted: mek });

        await sleep(2000);
        await conn.groupLeave(from);

    } catch (e) {
        console.error("Leave command error:", e);
        reply(`❌ *Error occurred while leaving group.*\n\n${e.message}`);
    }
});
