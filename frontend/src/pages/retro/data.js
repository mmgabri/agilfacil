export const quotes = [
  {
    id: "1",
    content: "Sometimes life is scary and dark",
  },
  {
    id: "2",
    content:
      "Sucking at something is the first step towards being sorta good at something.",
  },
  {
    id: "3",
    content: "You got to focus on what's real, man",
  },
  {
    id: "4",
    content: "Is that where creativity comes from? From sad biz?",
  },
  {
    id: "5",
    content: "Homies help homies. Always",
  },
  {
    id: "6",
    content: "Responsibility demands sacrifice",
  },
  {
    id: "7",
    content: "That's it! The answer was so simple, I was too smart to see it!",
  },
  {
    id: "8",
    content:
      "People make mistakes. It's all a part of growing up and you never really stop growing",
  },
  {
    id: "9",
    content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
  },
  {
    id: "10",
    content: "I should not have drunk that much tea!",
  },
  {
    id: "11",
    content: "Please! I need the real you!",
  },
  {
    id: "12",
    content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
  }
];

// So we do not have any clashes with our hardcoded ones
let idCount = quotes.length + 1;

export const getQuotes = (count) =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];

    const custom = {
      ...random,
      id: `G${idCount++}`
    };

    return custom;
  });