# Nitu — Transit Portfolio

Personal portfolio of **Shah Sanjida Rahman Nitu**: machine learning research on NASA TESS and Kepler exoplanet data.

The hero shows a planet passing in front of the portrait while a live light curve records the brightness dip, the same signal the research looks for.

Built with **Next.js 15 (App Router)**, **React 19** and **TypeScript**. Hosted on **Vercel**.

---

## Project structure

```
nitu-portfolio/
├── app/
│   ├── layout.tsx          # <html>, fonts, SEO / social-share metadata
│   ├── page.tsx            # the page: puts all sections in order
│   ├── globals.css         # all styles (colors are the tokens at the top)
│   ├── api/contact/route.ts  # backend: contact form → email (Resend)
│   ├── sitemap.ts          # /sitemap.xml
│   └── robots.ts           # /robots.txt
├── components/
│   ├── Hero.tsx            # name, intro, portrait + transiting planet, live light curve
│   ├── Starfield.tsx       # twinkling background
│   ├── Sections.tsx        # About, Research, Data, Skills, Leadership, Footer
│   ├── Contact.tsx         # contact form + direct details
│   └── Rich.tsx            # text with inline links
├── data/
│   └── content.ts          # ★ ALL TEXT ON THE SITE — edit this to update
├── lib/
│   └── transit.ts          # transit physics + canvas drawing
├── public/
│   ├── photo.jpg           # profile photo (square)
│   └── Shah_Sanjida_Rahman_Nitu_CV.pdf
└── .env.example            # environment variables to set
```

## Updating content

Almost every change happens in **`data/content.ts`**:

- New research project → add an object to `research`
- New award or event → add to `milestones`
- New role → add to `leadership`
- New skill → edit `skills`

To change the photo or CV, replace the file in `public/` and keep the same name.

## Run it on your computer

Needs [Node.js](https://nodejs.org) 18.18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The page reloads as you save files.

Before pushing, check that it builds:

```bash
npm run build
```

## Deploy on Vercel

1. Push this project to GitHub.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, and click **Add New → Project**.
3. Import this repository. Vercel detects Next.js automatically, so keep the default settings.
4. Under **Environment Variables**, add the ones from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL.
5. Click **Deploy**.

After this, every `git push` to `main` redeploys the site automatically.

## Contact form (optional)

The form sends messages to your inbox through [Resend](https://resend.com), which is free for small volumes.

1. Create a Resend account and an API key.
2. In Vercel, add `RESEND_API_KEY` (the key) and `CONTACT_TO_EMAIL` (your inbox). Use the same email you signed up to Resend with.
3. Redeploy.

Until these are set, the form tells visitors to use the email address shown on the page.
