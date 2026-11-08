# Chang Heng Wei

I'm a data engineering student at Universiti Teknologi Malaysia (UTM). I write small programs and data systems, and I keep notes on how I built them so I can retrace a decision months later. Most of it so far is coursework and scripts.

This repository is my e-portfolio, published at [changhengwei.github.io](https://changhengwei.github.io). I built it for my SCST1133 e-portfolio assignment and add to it when I finish a course or go to a talk worth writing up.

## What's on the site

The home page opens with an intro, a photo, five skill boxes and a counter row. The counter takes its numbers from the data files, so it currently reads 0 projects, 1 event and 2 certificates.

The five skill boxes are Python, SQL, Git, GitHub and VS Code. Projects is empty; I haven't put a full project out yet. Events has one write-up: an industrial talk on Creative Thinking by Dr. Zahari Othman at UTM Skudai on 3 November 2026. Its detail page has four photos and my notes on metacognition, Polya's problem solving model, and where those ideas fit in cloud architecture and data pipelines. Certificates holds two courses I finished in 2026: CS50's Introduction to Programming with Python and CS50's Introduction to Databases with SQL. Each card shows the certificate scan and a short line on what the course lets me do.

Contact has my email, GitHub and LinkedIn. Clicking the email box does nothing; the Copy button inside copies the address to the clipboard.

Two circle buttons in the top right control the theme and the background music. Light mode and music on are the defaults on a first visit. Both choices are saved in `localStorage`, so the event and project pages use the same settings. Browsers block sound until the first click, so playback starts then.

## How it's built

It's plain HTML, CSS and JavaScript, so GitHub Pages serves the files as they are. There's no install or build step. The three content lists are arrays in `assets/js/data/`: `projects.js`, `events.js` and `certificates.js`. `assets/js/app.js` renders the cards, the counters and the two detail pages from those arrays. `event.html` and `project.html` read an `id` from the URL. Fonts are Space Grotesk, Inter and JetBrains Mono from Google Fonts. The animated mailbox in Contact is a small ESM bundle in `assets/js/fun/`.

## Files

```
changhengwei.github.io/
├── index.html
├── event.html
├── project.html
├── README.md
├── .gitignore
└── assets/
    ├── css/style.css
    ├── js/
    │   ├── app.js
    │   ├── data/          projects.js, events.js, certificates.js
    │   └── fun/           fun-bundle.js
    ├── audio/             background-music.mp3
    └── img/               profile.jpg, favicon.svg, certs/, events/
```

## Adding content

Edit the matching file in `assets/js/data/` and copy an existing object with a new `id`. Images go under `assets/img/`. The counters and the detail pages pick up new entries on the next page load, so no numbers need editing by hand.

## Run it locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`. Opening `index.html` straight from disk works too, though the Copy button and the mailbox module need the local server.

## Hosting

GitHub Pages serves this repository from the `main` branch at the root. The repository name has to be `changhengwei.github.io` for the URL above to work. Push a changed file and the site updates after the Pages rebuild. `assets/audio/background-music.mp3` needs to be in the repo or the music button stays silent.

## Contact

Email me at `changhengwei@graduate.utm.my`. My code is on [GitHub](https://github.com/changhengwei) and my profile is on [LinkedIn](https://www.linkedin.com/in/chang-heng-wei-181b88375/). I'm open to internships and questions about data work.
