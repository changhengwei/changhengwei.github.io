/* events.js
   Talks, visits and hackathons. The hero count comes from this array's
   length. To add one, copy the template at the bottom in with a new id.
   images: photo paths in bento slot order. The detail page places them
           in that order, so check the .bento rules in style.css.
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

    /* One line above the Takeaways grid. */
    takeaway: "Generating the options is the creative step; choosing between them on evidence is the critical step.",

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
    videoNote: "Video link coming soon",

    /* Takeaway sections. */
    takeaways: [
      {
        n: "01",
        h: "Introduction to the talk and the presenter",
        p: "The industrial talk was held at UTM Skudai, Johor, under the title \"Creative Thinking\", and was presented by Dr Zahari Othman, Director of the Center for Teaching Thinking and Innovation (CenT-TI). CenT-TI provides workshops and staff development programmes for schools and universities that want critical and creative thinking built into how they teach. In the centre's director's message, Dr Zahari argues that education should develop the minds of learners so they can think critically and creatively to solve non-routine problems, rather than simply passing information to them. The session covered what metacognition is, the types of thinking, Polya's problem solving model, and a ladder of metacognition."
      },
      {
        n: "02",
        h: "What I learned from the presenter",
        p: "The idea that stayed with me is that metacognition means thinking about your own thinking. You step back and ask what kind of thinking you are doing, whether the strategy you chose is working, and what you will do differently next time. Dr Zahari laid this out as a ladder, from being aware of the kind of thinking you are doing, to knowing the strategy you are using while you think, to evaluating whether it worked, to planning how you will approach the same thinking in future. He also cited David Perkins on the four levels of metacognitive learners, from the tacit learner who is unaware of their own cognitive processes to the reflective learner who monitors and adjusts. The line I remember most is his: teach students everything we know and their knowledge is limited to ours, teach them to think and their knowledge is limitless. That applies to how I revise for our AWS subject, where the service list goes out of date but the reasoning behind it does not."
      },
      {
        n: "03",
        h: "How creative thinking relates to cloud computing",
        p: "Creative thinking is the divergent, lateral and parallel thinking that produces alternative solutions, new perspectives and new possibilities. In our Introduction to Cloud Computing subject, the tempting route with AWS is to memorise that EC2 hosts virtual machines, S3 stores objects and Lambda runs functions, then rebuild the architecture from the lab notes. Creative thinking pushes me to generate several architectures for the same requirement before committing to one. A student web application shows this. It can run on a single EC2 instance with everything installed by hand, cheap at low traffic but leaving me to patch the OS and scale manually. It can split into S3 with CloudFront for static files, Lambda for the logic and DynamoDB or RDS for the data. It can be serverless behind API Gateway, or containerised on ECS. Each design solves the same problem, and they differ in cost per request, cold starts and how much operational burden stays with me. Generating the options is the creative step. Choosing between them on evidence about traffic, reliability and cost is the critical step."
      },
      {
        n: "04",
        h: "How creative thinking relates to data engineering",
        p: "Data engineering is where this matters most, because a pipeline can be built in several valid ways and the design decides how much pain arrives later in maintenance. For a nightly pipeline loading transaction records from an operational database, the options run from a full reload that overwrites the table every night, to incremental change data capture writing partitioned files to S3, to a real-time stream through Kinesis, to a lakehouse where bronze, silver and gold layers hold different levels of refinement. Choosing among them means asking the questions the framework makes concrete. Is the load spiky or steady, and does that justify streaming? How are late arriving records handled? Can the job be re-run without double counting? The parts and whole relationship applies here too, since a pipeline is made of ingestion, storage, transformation, orchestration, testing and consumption, and without the testing part bad data reaches the dashboard silently instead of failing loudly. Building the pipeline is half the work, and revising the design when its assumptions turn out wrong is the other half."
      }
    ],

    /* Closing paragraph. */
    closing: "Thank you for Dr. Zahari Othman for giving us such a helpful and interesting talk! I have gained a lot of new insights from this talk and prepared to apply them into my daily life and my courseworks."
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
    takeaway: "What I learned from this event.",
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
    takeaways: [
      { n: "01", h: "Section heading", p: "Section body text." }
    ],
    closing: "Optional closing paragraph."
  }
  */
];
