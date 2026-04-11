import prisma from "../src/lib/prisma.js";

type SeedQuestion = {
  text: string;
  answers: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

type SeedCategory = {
  name: string;
  icon: string;
  questions: SeedQuestion[];
};

const categories: SeedCategory[] = [
  {
    name: "Science",
    icon: "microscope",
    questions: [
      {
        text: "What planet is known as the Red Planet?",
        answers: ["Earth", "Venus", "Mars", "Jupiter"],
        correctIndex: 2,
      },
      {
        text: "What is the chemical symbol for gold?",
        answers: ["Au", "Ag", "Gd", "Go"],
        correctIndex: 0,
      },
      {
        text: "How many bones are in the adult human body?",
        answers: ["206", "201", "196", "212"],
        correctIndex: 0,
      },
      {
        text: "What gas do plants absorb from the atmosphere?",
        answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        correctIndex: 1,
      },
      {
        text: "What is the largest organ in the human body?",
        answers: ["Liver", "Lungs", "Skin", "Heart"],
        correctIndex: 2,
      },
      {
        text: "What is the speed of light in vacuum (approx)?",
        answers: ["300,000 km/s", "150,000 km/s", "30,000 km/s", "3,000 km/s"],
        correctIndex: 0,
      },
      {
        text: "Which blood type is known as the universal donor?",
        answers: ["AB+", "O-", "O+", "A-"],
        correctIndex: 1,
      },
      {
        text: "What part of the cell contains genetic material?",
        answers: ["Ribosome", "Mitochondria", "Nucleus", "Membrane"],
        correctIndex: 2,
      },
      {
        text: "What force keeps planets in orbit around the sun?",
        answers: ["Magnetism", "Friction", "Gravity", "Pressure"],
        correctIndex: 2,
      },
      {
        text: "What is H2O commonly known as?",
        answers: ["Hydrogen", "Oxygen", "Salt", "Water"],
        correctIndex: 3,
      },
    ],
  },
  {
    name: "History",
    icon: "landmark",
    questions: [
      {
        text: "Who was the first President of the United States?",
        answers: ["Thomas Jefferson", "George Washington", "John Adams", "Abraham Lincoln"],
        correctIndex: 1,
      },
      {
        text: "In which year did World War II end?",
        answers: ["1943", "1944", "1945", "1946"],
        correctIndex: 2,
      },
      {
        text: "Which civilization built Machu Picchu?",
        answers: ["Maya", "Aztec", "Inca", "Roman"],
        correctIndex: 2,
      },
      {
        text: "The Roman Empire fell in which year CE?",
        answers: ["476", "356", "622", "1492"],
        correctIndex: 0,
      },
      {
        text: "Who wrote the Declaration of Independence?",
        answers: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "James Madison"],
        correctIndex: 2,
      },
      {
        text: "Which wall came down in 1989?",
        answers: ["Great Wall of China", "Berlin Wall", "Hadrian's Wall", "Wailing Wall"],
        correctIndex: 1,
      },
      {
        text: "Who was known as the Maid of Orleans?",
        answers: ["Cleopatra", "Joan of Arc", "Queen Victoria", "Marie Curie"],
        correctIndex: 1,
      },
      {
        text: "What was the name of the ship on which the Pilgrims traveled to America in 1620?",
        answers: ["Santa Maria", "Mayflower", "Beagle", "Endeavour"],
        correctIndex: 1,
      },
      {
        text: "Who was the first emperor of Rome?",
        answers: ["Julius Caesar", "Nero", "Augustus", "Constantine"],
        correctIndex: 2,
      },
      {
        text: "The French Revolution began in which year?",
        answers: ["1776", "1789", "1812", "1848"],
        correctIndex: 1,
      },
    ],
  },
  {
    name: "Geography",
    icon: "globe",
    questions: [
      {
        text: "What is the largest ocean on Earth?",
        answers: ["Atlantic", "Indian", "Pacific", "Arctic"],
        correctIndex: 2,
      },
      {
        text: "Which country has the largest population?",
        answers: ["India", "United States", "China", "Indonesia"],
        correctIndex: 0,
      },
      {
        text: "What is the capital city of Canada?",
        answers: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
        correctIndex: 2,
      },
      {
        text: "Mount Everest lies in which mountain range?",
        answers: ["Andes", "Himalayas", "Alps", "Rockies"],
        correctIndex: 1,
      },
      {
        text: "Which river is the longest in the world?",
        answers: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correctIndex: 1,
      },
      {
        text: "Which desert is the largest hot desert?",
        answers: ["Sahara", "Gobi", "Kalahari", "Mojave"],
        correctIndex: 0,
      },
      {
        text: "What is the smallest country in the world?",
        answers: ["Monaco", "Liechtenstein", "Vatican City", "San Marino"],
        correctIndex: 2,
      },
      {
        text: "Which US state has the most people?",
        answers: ["Texas", "Florida", "New York", "California"],
        correctIndex: 3,
      },
      {
        text: "What is the capital city of Japan?",
        answers: ["Kyoto", "Osaka", "Tokyo", "Sapporo"],
        correctIndex: 2,
      },
      {
        text: "Which continent has the most countries?",
        answers: ["Asia", "Africa", "Europe", "South America"],
        correctIndex: 1,
      },
    ],
  },
];

async function main() {
  await prisma.$transaction([
    prisma.score.deleteMany(),
    prisma.answer.deleteMany(),
    prisma.question.deleteMany(),
    prisma.category.deleteMany(),
  ]);

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        icon: category.icon,
        questions: {
          create: category.questions.map((question) => ({
            text: question.text,
            answers: {
              create: question.answers.map((answerText, index) => ({
                text: answerText,
                isCorrect: index === question.correctIndex,
              })),
            },
          })),
        },
      },
    });
  }

  const usernames = ["ace", "nova", "pixel", "astro", "quark"];
  const users = await Promise.all(
    usernames.map((username) =>
      prisma.user.upsert({
        where: { username },
        update: {},
        create: { username },
      })
    )
  );

  const seededCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  for (const category of seededCategories) {
    for (const user of users) {
      const correctAnswers = 5 + Math.floor(Math.random() * 6);
      const totalQuestions = 10;
      const usedTimeMs = 70000 + Math.floor(Math.random() * 70000);
      const speedBonus = Math.floor(Math.max(totalQuestions * 15000 - usedTimeMs, 0) / 1000) * 10;
      const points = correctAnswers * 100 + speedBonus;

      await prisma.score.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          points,
          correctAnswers,
          totalQuestions,
          speedBonus,
        },
      });
    }
  }

  console.log("Seed complete: categories, questions, answers, users, and sample scores created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
