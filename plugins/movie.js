const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "movie",
  desc: "🎬 Fetch detailed information about a movie.",
  category: "utility",
  react: "🎥",
  filename: __filename
}, 
async (conn, mek, m, { from, reply, sender, args }) => {
  try {
    const movieName = args.length > 0 ? args.join(' ') : m.text.replace(/^[\.\#\$\!]?movie\s?/i, '').trim();

    if (!movieName) {
      return conn.sendMessage(from, {
        text: "🎬 *Please provide the name of the movie.*\n\n_Example:_ `.movie Inception`",
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420342566562@newsletter',
            newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    }

    const apiUrl = `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.status || !response.data.movie) {
      return reply("🚫 Movie not found. Please check the name and try again.");
    }

    const movie = response.data.movie;
    const dec = `
╭─🎬 *Movie Info*
│
├ 📌 *Title:* ${movie.title} (${movie.year})
├ ⭐ *IMDb:* ${movie.imdbRating || 'N/A'}
├ 🍅 *Rotten Tomatoes:* ${movie.ratings.find(r => r.source === 'Rotten Tomatoes')?.value || 'N/A'}
├ 💰 *Box Office:* ${movie.boxoffice || 'N/A'}
├ 📅 *Released:* ${new Date(movie.released).toLocaleDateString()}
├ ⏳ *Runtime:* ${movie.runtime}
├ 🎭 *Genre:* ${movie.genres}
├ 🎥 *Director:* ${movie.director}
├ ✍️ *Writer:* ${movie.writer}
├ 🌟 *Actors:* ${movie.actors}
├ 🌍 *Country:* ${movie.country}
├ 🗣️ *Language:* ${movie.languages}
├ 🏆 *Awards:* ${movie.awards || 'None'}
│
╰ 🔗 [View on IMDb](${movie.imdbUrl})
    `.trim();

    await conn.sendMessage(from, {
      image: {
        url: movie.poster && movie.poster !== 'N/A' ? movie.poster : 'https://files.catbox.moe/nex0fm.jpg'
      },
      caption: dec,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363420342566562@newsletter',
          newsletterName: 'PᴏᴘᴋɪᴅXᴛᴇᴄʜ',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error('🎬 Movie command error:', e);
    return reply("❌ Error while fetching movie info. Please try again.");
  }
});
