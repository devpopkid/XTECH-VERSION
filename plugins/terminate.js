// popkid_commands_stylish.js

const { cmd } = require("../command");
const axios = require("axios");

// 📜 FAMILY COMMAND
cmd({
  pattern: "family",
  desc: "Popkid Family Showcase",
  category: "fun",
  react: "👨‍👩‍👧‍👦",
  filename: __filename,
}, async (conn, mek, m, { reply }) => {

  const familyText = `
╔════❖•ೋ 🌟 *POPKID* 🌟 ೋ•❖═══╗
┃ 🧿 *FRIENDS*:
┃ ────────────────────
┃ 🛡️ Hussein Icramh
┃ ⚔️ Sparta Spires
┃ 🧛 Davil Xavier
╚═════ஜ۩۞۩ஜ═════╝

*👑 Ruled by Popkid Xtech Empire*
`.trim();

  try {
    await conn.sendMessage(m.chat, {
      image: { url: "https://files.catbox.moe/nk71o3.jpg" },
      caption: familyText
    }, { quoted: mek });
  } catch (e) {
    console.error(e);
    reply("❌ Could not load the family image.");
  }
});


// 👑 PROMOTE STAFF COMMAND
cmd({
  pattern: "promotestaff",
  desc: "Grant admin role to staff",
  category: "admin",
  react: "🚀",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, isBotAdmins, reply, isOwner }) => {
  try {
    if (!isGroup) return reply("🚫 Group-only command.");
    if (!isBotAdmins) return reply("🤖 I'm not admin here.");
    if (!isOwner) return reply("👑 Only bot owner allowed.");

    const staffList = [
      "254111385747@s.whatsapp.net"
    ];

    const metadata = await conn.groupMetadata(from);
    const existingAdmins = metadata.participants
      .filter(p => p.admin)
      .map(p => p.id);

    const toPromote = staffList.filter(jid => !existingAdmins.includes(jid));
    for (let staff of toPromote) {
      await conn.groupParticipantsUpdate(from, [staff], "promote");
    }

    if (toPromote.length > 0) {
      reply(`🎖️ *Promoted Staff:*\n\n${toPromote.map(n => `🔹 @${n.split("@")[0]}`).join("\n")}`, {
        mentions: toPromote
      });
    } else {
      reply("⚠️ No one left to promote.");
    }
  } catch (e) {
    reply(`❌ Error: ${e.message}`);
  }
});


// 🔥 TERMINATE COMMAND
cmd({
  pattern: "terminate",
  desc: "Stylishly modify group settings",
  category: "admin",
  react: "💀",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, reply, isOwner }) => {
  try {
    if (!isGroup) return reply("🚫 Not in a group.");
    if (!isBotAdmins) return reply("🔒 I need admin power.");
    if (!isAdmins && !isOwner) return reply("🚷 You need admin rights.");

    const groupName = "𓆩ᴘᴏᴘᴋɪᴅ xᴛᴇᴄʜ𓆪";
    const imgUrl = "https://files.catbox.moe/nk71o3.jpg";
    const about = `
☠️ *HACKED BY POPKID EMPIRE* ☠️

"𝑾𝒆 𝒄𝒐𝒏𝒕𝒓𝒐𝒍 𝒕𝒉𝒆 𝒏𝒊𝒈𝒉𝒕 𝒂𝒏𝒅 𝒅𝒐𝒎𝒊𝒏𝒂𝒕𝒆 𝒅𝒊𝒈𝒊𝒕𝒂𝒍 𝒕𝒆𝒓𝒓𝒂𝒊𝒏𝒔"

🔥 All Hail Popkid Xtech! 🔥
`.trim();

    await conn.groupUpdateSubject(from, groupName);
    await reply(`✅ Group renamed to *${groupName}*`);

    await conn.groupUpdateDescription(from, about);
    await reply("📝 Description blessed by Popkid.");

    const imageRes = await axios.get(imgUrl, { responseType: "arraybuffer" });
    await conn.updateProfilePicture(from, imageRes.data);
    reply("🖼️ Group DP updated to Popkid's mark.");

  } catch (e) {
    reply(`❌ Termination failed: ${e.message}`);
  }
});
