const { cmd, commands } = require('../command');
const { exec } = require('child_process');
const config = require('../config');
const { sleep } = require('../lib/functions');

// 1. Shutdown Bot
cmd({
  pattern: "shutdown",
  desc: "Shutdown the bot.",
  category: "owner",
  react: "🚝",
  filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  await reply("🚝 Shutting down...");
  process.exit();
});

// 2. Broadcast Message to All Groups
cmd({
  pattern: "broadcast",
  desc: "Broadcast a message to all groups.",
  category: "owner",
  react: "📢",
  filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  if (args.length === 0) return reply("📢 Please provide a message to broadcast.");

  const message = args.join(' ');
  const groups = Object.keys(await conn.groupFetchAllParticipating());

  for (const groupId of groups) {
    await conn.sendMessage(groupId, { text: message }, { quoted: mek });
    await sleep(1500); // Prevent flood
  }

  reply("📢 Message broadcasted to all groups.");
});

// 3. Set Profile Picture
cmd({
  pattern: "setpp",
  desc: "Set bot profile picture.",
  category: "owner",
  react: "🖼️",
  filename: __filename
}, async (conn, mek, m, { isOwner, quoted, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  if (!quoted || !quoted.message.imageMessage) return reply("❌ Please reply to an image.");

  try {
    const media = await conn.downloadMediaMessage(quoted);
    await conn.updateProfilePicture(conn.user.id, media);
    reply("🖼️ Profile picture updated successfully!");
  } catch (error) {
    reply(`❌ Error updating profile picture: ${error.message}`);
  }
});

// 4. Clear All Chats
cmd({
  pattern: "clearchats",
  desc: "Clear all chats from the bot.",
  category: "owner",
  react: "🧹",
  filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");

  try {
    const chats = Object.values(conn.chats);
    for (const chat of chats) {
      await conn.modifyChat(chat.id, 'delete');
    }
    reply("🧹 All chats cleared successfully!");
  } catch (error) {
    reply(`❌ Error clearing chats: ${error.message}`);
  }
});

// 5. Get Bot JID
cmd({
  pattern: "jid",
  desc: "Get the bot's JID.",
  category: "owner",
  react: "🤖",
  filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");
  reply(`🤖 *Bot JID:* ${conn.user.id}`);
});

// 6. Group JIDs List
cmd({
  pattern: "gjid",
  desc: "Get the list of JIDs for all groups the bot is in.",
  category: "owner",
  react: "📜",
  filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
  if (!isOwner) return reply("❌ You are not the owner!");

  const groups = await conn.groupFetchAllParticipating();
  const groupJids = Object.keys(groups).join('\n');
  reply(`📜 *Group JIDs:*\n\n${groupJids}`);
});

// 7. Delete Quoted Message
cmd({
  pattern: "delete",
  alias: ["del"],
  desc: "Delete quoted message.",
  category: "group",
  react: "❌",
  use: ".del",
  filename: __filename
}, async (conn, mek, m, { isOwner, isAdmins, quoted, reply }) => {
  if (!isOwner && !isAdmins) return reply("❌ Only admin or owner can delete messages.");
  if (!m.quoted) return reply("⚠️ Please reply to the message you want to delete.");

  try {
    const key = {
      remoteJid: m.chat,
      fromMe: false,
      id: m.quoted.id,
      participant: m.quoted.sender
    };
    await conn.sendMessage(m.chat, { delete: key });
  } catch (error) {
    console.log(error);
    reply("❌ Failed to delete message.");
  }
});
