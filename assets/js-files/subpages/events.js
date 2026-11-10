/* events.js
   Talks, visits and hackathons. The hero count comes from this array's
   length. To add one, copy the template at the bottom in with a new id.
   images: photo paths in bento slot order. The detail page places them
           in that order, so check the .bento rules in style.css.
   reflection: paragraphs for the Reflection article on the detail page.
   poster / video: still in the data, but the detail page uses cover
           for the hero image and does not show a video. */
window.EVENTS = [
  {
    id: "creative-thinking",
    title: "Creative Thinking",
    type: "Industrial Talk",
    date: "3 November 2026",
    time: "10.00 AM – 6.00 PM",
    location: "N28 Faculty of Computing, UTM Skudai",
    presenter: "Dr. Zahari Othman",
    presenterRole: "Director, Center for Teaching Thinking & Innovation (CenT-TI)",

    cover: "assets/img/events/creative-thinking-poster.webp",
    poster: "assets/img/events/creative-thinking-poster.webp",

    /* Shown on the homepage card. */
    summary: "Thinking about your own thinking changes how you build. Dr. Zahari Othman walks through metacognition, Polya's problem solving model and creative thinking, then shows them at work on cloud architecture and data pipelines.",

    /* Shown on the detail page. */
    description: "An industrial talk at UTM Skudai on what metacognition is, the types of thinking, Polya's problem solving model and a ladder of metacognition. Dr. Zahari argues we should design systems this way, not only study them this way.",

    /* The event page's Reflection section. Five paragraphs, in order. */
    reflection: [
      "Attending the industrial talk by Dr. Zahari Othman on metacognitive and creative thinking provided valuable insights into structured problem-solving and self-regulated cognitive strategies. I synthesised these principles into an academic report to demonstrate how metacognitive monitoring and creative thinking apply directly to Cloud Computing and Data Engineering.",
      "Throughout this task, I applied the concept of higher-order thinking, specifically using inductive reasoning to identify patterns across raw datasets and metacognitive self-evaluations to refine my analytical workflows.",
      "The primary challenge was bridging high-level, abstract cognitive theories with technical computing paradigms. I resolved this by mapping lateral thinking to scalable cloud architecture design (such as migrating rigid, always-on EC2 setups to event-driven, cost-effective AWS Lambda serverless models) and data pipeline fault-tolerance.",
      "This experience demonstrates Course Learning Outcomes (CLOs) centered on critical inquiry, creative problem-solving, and the practical evaluation of emerging technologies.",
      "Moving forward, I aim to investigate automated data quality validation frameworks and conduct real-time metacognitive self-audits during complex pipeline debugging to continuously optimize performance."
    ],

    /* Bento slot order: 01 is the big 2x2, 03 is the wide 2x1. */
    images: [
      "assets/img/events/creative-thinking-01.webp",
      "assets/img/events/creative-thinking-02.webp",
      "assets/img/events/creative-thinking-04.webp",
      "assets/img/events/creative-thinking-03.webp"
    ],

    /* Alt text, in the same order as images. */
    imageAlts: [
      "Dr. Zahari Othman presenting beside the projected Creative Thinking slide, seen from the audience",
      "Handwritten notes taken during the talk, listing the types of thinking and what metacognition means",
      "Dr. Zahari Othman speaking into a handheld microphone in front of the whiteboard",
      "The whiteboard covered in equations and notes on critical, creative and metacognitive thinking"
    ],

    /* The detail page does not render these video fields. */
    video: "",
    videoNote: "Video link coming soon"
  }

  /* Template: copy this into the array and fill it in:
  {
    id: "my-event",
    title: "My Event",
    type: "Industrial Talk",
    date: "3 November 2026",
    time: "10.00 AM – 6.00 PM",
    location: "Venue, UTM Skudai",
    presenter: "Speaker Name",
    presenterRole: "Title, Organisation",
    cover: "assets/img/events/my-event.svg",
    poster: "assets/img/events/my-event.svg",
    summary: "Short text shown on the card.",
    description: "Longer text shown on the detail page.",
    images: [
      "assets/img/events/my-event-1.svg",
      "assets/img/events/my-event-2.svg"
    ],
    imageAlts: [
      "First photo description",
      "Second photo description"
    ],
    video: "assets/videos/my-event.mp4",   // "" if none yet
    videoNote: "Video link coming soon",
    reflection: [
      "First paragraph.",
      "Second Paragraph."
    ]
  }
  */
];
