const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
const fetch = require("node-fetch");

// 📽 YouTube Video Downloader
cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.mp4 < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, q, reply }) => { 
    try { 
        if (!q) return await reply("❗ Please provide a YouTube URL or video name.");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("❌ No results found!");

        const yts = yt.results[0];  
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        const videoRes = await fetch(apiUrl).then(res => res.json());

        if (!videoRes.success || !videoRes.result.download_url) {
            return reply("⚠️ Failed to fetch video. Please try again later.");
        }

        const ytmsg = `📥 *YOUTUBE VIDEO DOWNLOADER*

🎬 *Title:* ${yts.title}
⏳ *Duration:* ${yts.timestamp}
👁️ *Views:* ${yts.views}
🎙️ *Author:* ${yts.author.name}
🔗 *Link:* ${yts.url}

👑 *Powered by PopkidXtech*
`.trim();

        await conn.sendMessage(from, {
            video: { url: videoRes.result.download_url },
            caption: ytmsg,
            mimetype: "video/mp4",
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420342566562@newsletter',
                    newsletterName: "PᴏᴘᴋɪᴅXᴛᴇᴄʜ",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("MP4 Error:", e);
        reply("💔 An error occurred while fetching the video.");
    }
});

// 🎧 YouTube MP3 Downloader
cmd({
    pattern: "song",
    alias: ["play", "mp3"],
    react: "🎧",
    desc: "Download YouTube song",
    category: "main",
    use: '.song <query>',
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("🎶 Please provide a song name or YouTube link.");

        await reply("🔍 Searching for the track...");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("❌ No song found. Try a different query.");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        const songRes = await fetch(apiUrl).then(res => res.json());

        if (!songRes?.result?.downloadUrl) return reply("⚠️ Unable to download the song.");

        await conn.sendMessage(from, {
            audio: { url: songRes.result.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${song.title}.mp3`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420342566562@newsletter',
                    newsletterName: "PᴏᴘᴋɪᴅXᴛᴇᴄʜ",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `🎶 ${song.title.length > 25 ? song.title.substring(0, 22) + '...' : song.title} 🎵`,
                    body: `Artist: ${song.author}\nViews: ${song.views}\nDuration: ${song.timestamp}`,
                    thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
                    mediaType: 1,
                    sourceUrl: song.url,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await reply("✅ Song downloaded successfully. Enjoy your music! 🎧");

    } catch (error) {
        console.error("SONG ERROR:", error);
        reply("💔 Oops! An error occurred. Please try again.");
    }
});
