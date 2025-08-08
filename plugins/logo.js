//---------------------------------------------
//           POPKID-MD  
//---------------------------------------------
//   ⚠️ AUTO-GENERATED. DO NOT MODIFY DIRECTLY ⚠️
//---------------------------------------------

const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions2');

const logoEffects = [
  {
    pattern: '3dcomic',
    url: 'https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html',
    desc: 'Create a 3D Comic-style text effect',
  },
  {
    pattern: 'dragonball',
    url: 'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html',
    desc: 'Create a Dragon Ball-style text effect',
  },
  {
    pattern: 'deadpool',
    url: 'https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html',
    desc: 'Create a Deadpool-style text effect',
  },
  {
    pattern: 'blackpink',
    url: 'https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html',
    desc: 'Create a Blackpink-style text effect',
  },
  {
    pattern: 'neonlight',
    url: 'https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html',
    desc: 'Create a Neon Light-style text effect',
  },
  {
    pattern: 'cat',
    url: 'https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html',
    desc: 'Create a Foggy Glass Handwriting-style text effect',
  },
  {
    pattern: 'sadgirl',
    url: 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html',
    desc: 'Create a Sad Girl-style wet glass text effect',
  },
  {
    pattern: 'pornhub',
    url: 'https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html',
    desc: 'Create a Pornhub-style text logo',
  },
  {
    pattern: 'naruto',
    url: 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html',
    desc: 'Create a Naruto Shippuden-style logo',
  },
  {
    pattern: 'thor',
    url: 'https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html',
    desc: 'Create a Thor-style logo',
  },
  {
    pattern: 'america',
    url: 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html',
    desc: 'Create an American Flag-style text effect',
  },
  {
    pattern: 'eraser',
    url: 'https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html',
    desc: 'Create an Eraser-style deleting text effect',
  },
  {
    pattern: '3dpaper',
    url: 'https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html',
    desc: 'Create a 3D Paper Cut-style text effect',
  },
  {
    pattern: 'futuristic',
    url: 'https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html',
    desc: 'Create a Futuristic-style text effect',
  },
  {
    pattern: 'clouds',
    url: 'https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html',
    desc: 'Create a Cloud-style sky text effect',
  },
  {
    pattern: 'sans',
    url: 'https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html',
    desc: 'Create a Sand Writing-style effect',
  },
  {
    pattern: 'galaxy',
    url: 'https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html',
    desc: 'Create a Galaxy wallpaper text effect',
  },
  {
    pattern: 'leaf',
    url: 'https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html',
    desc: 'Create a Leaf Brush-style typography effect',
  }
];

// Auto-register all logo commands
for (const effect of logoEffects) {
  cmd({
    pattern: effect.pattern,
    desc: effect.desc,
    category: "logo",
    react: "🎨",
    filename: __filename
  }, async (conn, mek, m, { from, args, reply }) => {
    try {
      if (!args.length) return reply(`❌ Please provide a name.\n\n*Example:* ${effect.pattern} Empire`);

      const name = args.join(" ");
      const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=${encodeURIComponent(effect.url)}&name=${encodeURIComponent(name)}`;

      const result = await fetchJson(apiUrl);

      if (!result?.result?.download_url) {
        return reply("❌ Failed to generate image. Try again.");
      }

      await conn.sendMessage(from, {
        image: { url: result.result.download_url },
        caption: `✅ *${effect.desc}*\n\n🧾 Name: *${name}*`,
        contextInfo: {
          externalAdReply: {
            title: "POP KID LOGO MAKER",
            body: `Command: ${effect.pattern}`,
            thumbnailUrl: result.result.download_url,
            sourceUrl: "https://en.ephoto360.com",
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363025087654321@g.us", // Optional: Fake group/channel
            newsletterName: "POP-KID Logos 🔥",
            serverMessageId: ""
          }
        }
      });

    } catch (e) {
      return reply(`❌ An error occurred:\n\n${e.message}`);
    }
  });
}
