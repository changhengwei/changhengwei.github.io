# Chang Heng Wei

I'm a data engineering student at UTM. I build small pieces of software and data systems, and I write down how I got there so I can find my way back later. Most of it so far is coursework, scripts and notes. I haven't put a full project out yet, so Projects is empty for now.

The tools I reach for are Python, SQL, Git, GitHub and VS Code. In 2026 I finished CS50's Introduction to Programming with Python and CS50's Introduction to Databases with SQL. Both certificates are on this site with a short note on what each one lets me do.

One thing I wrote up properly is an industrial talk on Creative Thinking by Dr. Zahari Othman at UTM Skudai. I took notes on metacognition and Polya's problem solving model, then worked through how they apply to choosing a cloud architecture and designing a data pipeline. The full write-up is on the Events detail page.

Email is the easiest way to reach me: `changhengwei@graduate.utm.my`. I'm open to internships and questions about data work. My code is on [GitHub](https://github.com/changhengwei) and my profile is on [LinkedIn](https://www.linkedin.com/in/chang-heng-wei-181b88375/).

## The site

Live at `https://changhengwei.github.io`. I put it together for my SCST1133 e-portfolio and keep adding to it.

It is plain HTML, CSS and JavaScript. There is no framework and no build step, so GitHub Pages serves the files as they are. The home page has a short intro, five skill boxes and a counter row that reads its numbers from the data files. Projects, Events and Certificates each come from one array in `assets/js/data/`. Projects and Events open their own detail page; Certificates stay as cards.

Light mode is the default on a first visit. The circle button in the top right shows a sun in light mode and a moon in dark mode; clicking it switches themes and saves the choice in `localStorage`. I removed the smooth-scroll library because the wheel felt laggy, so scrolling is the browser's own. GSAP comes from a CDN and the page runs fine without it.

The music button beside it loops `assets/audio/background-music.mp3` at low volume. It is on for a first-time visitor and the choice is saved in `localStorage`, so the event and project pages use the same setting. Browsers block sound before the first click, so playback begins on that first interaction. Both buttons lift with an accent-coloured border on hover.

The Email box in Contact is not a link. Clicking it does nothing; the `Copy` button inside copies my address to the clipboard. I set it up this way because a `mailto:` link opened a blank page on machines with no mail app registered.

## Files

```
changhengwei.github.io/
├── index.html            home page
├── project.html          project detail (reads ?id=)
├── event.html            event detail (reads ?id=)
├── README.md
├── assets/
│   ├── audio/            background-music.mp3, quiet loop
│   ├── css/style.css     colours, type and all component styles
│   ├── js/app.js         renders the grids and detail pages, handles interactions
│   ├── js/data/          projects.js, events.js, certificates.js
│   ├── js/fun/           animated mailbox bundle
│   └── img/              profile.jpg, favicon, event and certificate images
```

## Adding content

The three lists live in `assets/js/data/`. Edit one file and the home page cards, detail pages and counters update on the next load. The counters read the array length, so there are no numbers to change by hand.

### Project

Copy an object into `window.PROJECTS` in `projects.js` with a new `id`, then drop a cover image in `assets/img/projects/`.

```js
{
  id: "my-project",
  title: "My Project",
  tagline: "One-line pitch",
  category: "Web App",
  year: "2026",
  cover: "assets/img/projects/my-project.svg",
  summary: "Short text shown on the card.",
  description: "Longer text on the detail page.",
  takeaways: ["Lesson 1", "Lesson 2"],
  stack: ["HTML", "JavaScript"],
  live: "https://…",
  source: "https://github.com/changhengwei/…"
}
```

### Event

`events.js` has a commented template at the bottom. Copy it into `window.EVENTS` with a new `id`. The `images` array follows the bento grid slot order, so keep it in step with the `.bento` rules in `style.css`. `imageAlts` needs one line of alt text per photo, in the same order.

```js
{
  id: "my-event",
  title: "My Event",
  type: "Industrial Talk",
  date: "3 November 2026",
  time: "10.00 AM – 6.00 PM",
  location: "Venue, UTM Skudai",
  presenter: "Speaker Name",
  presenterRole: "Title, Organisation",
  cover: "assets/img/events/my-event.webp",
  poster: "assets/img/events/my-event.webp",
  summary: "Short text for the homepage card.",
  description: "Longer opening text for the detail page.",
  takeaway: "What I learned from this event.",
  images: [
    "assets/img/events/my-event-01.webp",
    "assets/img/events/my-event-02.webp"
  ],
  imageAlts: ["First photo", "Second photo"],
  video: "",
  videoNote: "Video link coming soon",
  takeaways: [
    { n: "01", h: "Section heading", p: "Section body text." }
  ],
  closing: "Optional closing paragraph."
}
```

Posters are portrait, so I crop them towards the top and save them as `.webp`. The detail page uses `cover` for the hero image. `poster` and `videoNote` are unused, and a `video` path only adds a badge to the home card.

### Certificate

Copy an object in `certificates.js` and give it a new `id`. Each card shows the image, the official name, the issuer and date, and a short description.

```js
{
  id: "my-cert",
  name: "Official Certificate Name",
  issuer: "Issuing organisation",
  date: "2026",
  detail: "Optional short line about what it involved",
  desc: "One or two lines on what this lets me do.",
  image: "assets/img/certs/my-cert.webp",
  link: "https://…"
}
```

Certificate images sit two per row at about `1800×1286`. Set `image` to `""` if there is no scan yet, and `link` to `""` if there is no verification URL.

### Name, photo, skills and links

The name, role, intro line and the five skill boxes are in `index.html`. The hero photo is `assets/img/profile.jpg`; replace that file or change the `src`. To add a skill, copy one `.skill` block and swap in the logo SVG. Keep the logos in colour and give each `<svg>` an `aria-label` so screen readers announce it.

The GitHub and LinkedIn URLs are in the `#contact` section of `index.html`. The email address is in three places there: the visible label, the `Copy` button's `data-copy` attribute, and the button's `aria-label`. Change all three if the address changes.

### Theme colours

Both themes are CSS variables at the top of `assets/css/style.css`:

```css
:root, :root[data-theme="dark"] { --bg: …; --text: …; --accent: …; --grad: …; }
:root[data-theme="light"]       { --bg: …; --text: …; --accent: …; --grad: …; }
```

Edit the values in both blocks and the components pick them up.

## Running it locally

Open `index.html` directly, or serve the folder so the clipboard and modules work:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Hosting on GitHub Pages

1. Create a public repository named exactly `changhengwei.github.io`. That name gives you `https://changhengwei.github.io`.
2. Upload `index.html`, `project.html`, `event.html`, `README.md`, `.gitignore` and the whole `assets/` folder. `assets/audio/background-music.mp3` has to be in there too; without it the button shows but stays silent. Or push with Git:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/changhengwei/changhengwei.github.io.git
git push -u origin main
```

3. In the repository settings, open Pages and set the source to Deploy from a branch, branch `main`, folder `/ (root)`. Save and wait a minute or two.
4. Check `https://changhengwei.github.io`.

To update later, edit the file, commit and push. There is no build step and the URL stays the same.

## Notes

Fonts are Space Grotesk, Inter and JetBrains Mono from Google Fonts. The animated mailbox next to the contact links is a small ESM bundle in `assets/js/fun/`.

The site publishes my UTM email address and links to my GitHub and LinkedIn. There is no phone number or home address on it.
