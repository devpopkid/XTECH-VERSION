const { cmd } = require('../command');

const blockedUsers = new Set(); // In-memory blocklist (can upgrade to DB if needed)

// BLOCK Command
cmd({
  pattern: "block",
  desc: "Block a user",
  category: "owner",
  react: "🚫",
  filename: __filename
}, async (conn, m, { reply, q, react }) => {
  const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";
  if (m.sender !== botOwner) {
    await react("❌");
    return reply("🚫 *Only the bot owner can use this command.*");
  }

  let jid;
  if (m.quoted) jid = m.quoted.sender;
  else if (m.mentionedJid?.length > 0) jid = m.mentionedJid[0];
  else if (q && q.includes("@")) jid = q.replace(/[@\s]/g, "") + "@s.whatsapp.net";
  else {
    await react("❌");
    return reply("📌 *Mention, reply or type the number to block.*");
  }

  try {
    await conn.updateBlockStatus(jid, "block");
    blockedUsers.add(jid);
    await react("✅");

    await conn.sendMessage(m.chat, {
      text: `✅ *User Blocked Successfully!*\n\n@${jid.split("@")[0]} has been blocked.`,
      mentions: [jid],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420342566562@newsletter",
          newsletterName: "Pᴏᴘᴋɪᴅ Oᴡɴᴇʀ 🔐",
          serverMessageId: 99
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("❌ Block Error:", e);
    await react("❌");
    reply("❌ *Failed to block the user.*");
  }
});

// UNBLOCK Command
cmd({
  pattern: "unblock",
  desc: "Unblock a user",
  category: "owner",
  react: "🔓",
  filename: __filename
}, async (conn, m, { reply, q, react }) => {
  const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";
  if (m.sender !== botOwner) {
    await react("❌");
    return reply("🚫 *Only the bot owner can use this command.*");
  }

  let jid;
  if (m.quoted) jid = m.quoted.sender;
  else if (m.mentionedJid?.length > 0) jid = m.mentionedJid[0];
  else if (q && q.includes("@")) jid = q.replace(/[@\s]/g, "") + "@s.whatsapp.net";
  else {
    await react("❌");
    return reply("📌 *Mention, reply or type the number to unblock.*");
  }

  try {
    await conn.updateBlockStatus(jid, "unblock");
    blockedUsers.delete(jid);
    await react("✅");

    await conn.sendMessage(m.chat, {
      text: `🔓 *User Unblocked Successfully!*\n\n@${jid.split("@")[0]} has been unblocked.`,
      mentions: [jid],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363420342566562@newsletter",
          newsletterName: "Pᴏᴘᴋɪᴅ Oᴡɴᴇʀ 🔐",
          serverMessageId: 100
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error("❌ Unblock Error:", e);
    await react("❌");
    reply("❌ *Failed to unblock the user.*");
  }
});

// BLOCKLIST Command
cmd({
  pattern: "blocklist",
  desc: "Shows list of blocked users",
  category: "owner",
  react: "📋",
  filename: __filename
}, async (conn, m, { reply, react }) => {
  const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";
  if (m.sender !== botOwner) {
    await react("❌");
    return reply("🚫 *Only the bot owner can use this command.*");
  }

  if (blockedUsers.size === 0) {
    return reply("✅ *No users are currently blocked.*");
  }

  const list = [...blockedUsers].map((jid, i) => `🔸 ${i + 1}. @${jid.split("@")[0]}`).join("\n");

  await conn.sendMessage(m.chat, {
    text: `📋 *Blocked Users List:*\n\n${list}`,
    mentions: [...blockedUsers],
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363420342566562@newsletter",
        newsletterName: "Pᴏᴘᴋɪᴅ Bᴏᴛ Mᴏᴅᴇ 🔐",
        serverMessageId: 101
      }
    }
  }, { quoted: m });
});
