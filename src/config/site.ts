export const siteConfig = {
  motherName: 'Mum',
  fromNames: ['Sweetu', 'Cutu'],
  birthdayMonth: 11,
  birthdayDay: 19,
  birthdayMessage: `Every single day, you fill our world with warmth that words can barely hold. Your laughter is the soundtrack of our happiest memories, your arms the safest place we have ever known. From the quiet mornings to the late-night conversations, you have been our anchor, our cheerleader, and our greatest love. Today, on your birthday, we want you to know that everything good in us reflects you. Thank you for your endless patience, your fierce love, and the way you make ordinary moments feel like magic. We love you more than all the stars — Happy Birthday, Mum! 🌸`,
  people: {
    mum: { name: 'Mum', caption: 'Our heart, our home, our everything' },
    sweetu: { name: 'Sweetu', caption: 'Sweet by name, sweeter by nature' },
    cutu: { name: 'Cutu', caption: 'The one who makes every moment brighter' },
  },
  heroSubtitle: 'A little corner of the internet, made just for you.',
  footerMessage: 'Made with every ounce of love we have — your Sweetu & Cutu 💕',
} as const;

export type PersonKey = keyof typeof siteConfig.people;
