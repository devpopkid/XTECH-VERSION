const converter = require('../data/converter');
const stickerConverter = require('../data/sticker-converter');
const { cmd } = require('../command');

// hoods
const contextForward = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363420342566562@newsletter',
    newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
    serverMessageId: 143
  }
};

// Convert Sticker to Image
cmd({
  pattern: 'convert',
  alias: ['sticker2img', 'stoimg', 'stickertoimage', 's2i'],
  desc: 'Convert stickers to images',
  category: 'media',
  react: '🖼️',
  filename: __filename
}, async (client, match, message, { from }) => {
  if (!message.quoted || message.quoted.mtype !== 'stickerMessage') {
    return client.sendMessage(from, {
      text: "🧷 *Reply to a sticker to convert*\n\nExample: `.convert`",
      contextInfo: contextForward
    }, { quoted: message });
  }

  await client.sendMessage(from, {
    text: "⏳ Converting sticker...",
    contextInfo: contextForward
  }, { quoted: message });

  try {
    const stickerBuffer = await message.quoted.download();
    const imageBuffer = await stickerConverter.convertStickerToImage(stickerBuffer);

    return client.sendMessage(from, {
      image: imageBuffer,
      mimetype: 'image/png',
      caption: "✅ *Here is your image!*\n_Powered by Popkid Xtech_",
      contextInfo: contextForward
    }, { quoted: message });
  } catch (e) {
    console.error('Convert Error:', e);
    return client.sendMessage(from, {
      text: "❌ Failed to convert. Try another sticker.",
      contextInfo: contextForward
    }, { quoted: message });
  }
});

// Convert Media to MP3
cmd({
  pattern: 'tomp3',
  desc: 'Convert video/audio to MP3',
  category: 'audio',
  react: '🎵',
  filename: __filename
}, async (client, match, message, { from }) => {
  if (!match.quoted || !['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
    return client.sendMessage(from, {
      text: "🎧 *Reply to a video or audio message*",
      contextInfo: contextForward
    }, { quoted: message });
  }

  if (match.quoted.seconds > 300) {
    return client.sendMessage(from, {
      text: "⏱️ Max allowed: 5 minutes.",
      contextInfo: contextForward
    }, { quoted: message });
  }

  await client.sendMessage(from, {
    text: "🎶 Converting to MP3...",
    contextInfo: contextForward
  }, { quoted: message });

  try {
    const buffer = await match.quoted.download();
    const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
    const audio = await converter.toAudio(buffer, ext);

    return client.sendMessage(from, {
      audio,
      mimetype: 'audio/mpeg',
      contextInfo: contextForward
    }, { quoted: message });
  } catch (e) {
    console.error('tomp3 Error:', e);
    return client.sendMessage(from, {
      text: "❌ Conversion failed.",
      contextInfo: contextForward
    }, { quoted: message });
  }
});

// Convert to Voice Note
cmd({
  pattern: 'toptt',
  desc: 'Convert media to voice note',
  category: 'audio',
  react: '🎙️',
  filename: __filename
}, async (client, match, message, { from }) => {
  if (!match.quoted || !['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
    return client.sendMessage(from, {
      text: "🎤 *Reply to video/audio under 1 minute*",
      contextInfo: contextForward
    }, { quoted: message });
  }

  if (match.quoted.seconds > 60) {
    return client.sendMessage(from, {
      text: "⏱️ Too long for PTT (max 1 min)",
      contextInfo: contextForward
    }, { quoted: message });
  }

  await client.sendMessage(from, {
    text: "🔁 Converting to voice note...",
    contextInfo: contextForward
  }, { quoted: message });

  try {
    const buffer = await match.quoted.download();
    const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
    const ptt = await converter.toPTT(buffer, ext);

    return client.sendMessage(from, {
      audio: ptt,
      ptt: true,
      mimetype: 'audio/ogg; codecs=opus',
      contextInfo: contextForward
    }, { quoted: message });
  } catch (e) {
    console.error('toptt Error:', e);
    return client.sendMessage(from, {
      text: "❌ Failed to convert to voice note.",
      contextInfo: contextForward
    }, { quoted: message });
  }
});
