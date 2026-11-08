/* certificates.js
   Two CS50 certificates so far. The hero count comes from this array's
   length. To add one, copy an object and give it a new id.
   name:   official title, shown as the card headline
   image:  scan in assets/img/certs/, or "" for no image
   link:   verification URL, or "" for none
   detail: optional short line about the course
   desc:   what I can do with it, in plain words */
window.CERTS = [
  {
    id: "cs50-python",
    name: "CS50's Introduction to Programming with Python",
    issuer: "CS50, Harvard University",
    date: "2026",
    detail: "Nine problem sets · one final project",
    desc: "Turn repetitive manual work into one-click automation: clean and merge spreadsheets, sort hundreds of files, pull live data off the web. The payoff is faster data preparation, quick prototypes, and small tools that save a team hours every week.",
    image: "assets/img/certs/cs50-python.webp",
    link: "https://cs50.harvard.edu/certificates/47f82fb1-a342-499f-bb41-e8e50f3df3a8"
  },
  {
    id: "cs50-sql",
    name: "CS50's Introduction to Databases with SQL",
    issuer: "CS50, Harvard University",
    date: "2026",
    detail: "Seven problem sets · one final project",
    desc: "Design a database and pull the exact numbers a business asks for: which products are selling, how many customers signed up each month, where the revenue comes from. You end up with clean answers you can turn into reports and dashboards.",
    image: "assets/img/certs/cs50-sql.webp",
    link: "https://cs50.harvard.edu/certificates/cab06d04-4a85-40b8-ba9b-c37227a4dc27"
  }
  /* Template: copy this into the array and fill it in:
  ,
  {
    id: "my-cert",
    name: "Official Certificate Name",
    issuer: "Issuing organisation",
    date: "2026",
    detail: "Optional short line about what it involved",
    desc: "One or two lines on what this lets you do practically.",
    image: "assets/img/certs/my-cert.webp",
    link: "https://…"
  }
  */
];
