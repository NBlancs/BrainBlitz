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
  {
    name: "Books",
    icon: "book",
    questions: [
      {
        text: "Who wrote 'Romeo and Juliet'?",
        answers: ["Charles Dickens", "Mark Twain", "William Shakespeare", "Jane Austen"],
        correctIndex: 2,
      },
      {
        text: "What is the first book of the Harry Potter series?",
        answers: ["Harry Potter and the Philosopher's Stone", "Harry Potter and the Chamber of Secrets", "Harry Potter and the Goblet of Fire", "Harry Potter and the Prisoner of Azkaban"],
        correctIndex: 0,
      },
      {
        text: "Who wrote '1984'?",
        answers: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells"],
        correctIndex: 0,
      },
      {
        text: "Who wrote 'Moby Dick'?",
        answers: ["Herman Melville", "Nathaniel Hawthorne", "Edgar Allan Poe", "Washington Irving"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the fantasy land in 'The Lion, the Witch and the Wardrobe'?",
        answers: ["Narnia", "Middle-earth", "Neverland", "Wonderland"],
        correctIndex: 0,
      },
      {
        text: "Who wrote 'The Great Gatsby'?",
        answers: ["F. Scott Fitzgerald", "Ernest Hemingway", "William Faulkner", "John Steinbeck"],
        correctIndex: 0,
      },
      {
        text: "In 'The Hobbit', what is Bilbo Baggins' home called?",
        answers: ["Bag End", "Rivendell", "Shire", "Brandy Hall"],
        correctIndex: 0,
      },
      {
        text: "Who wrote 'Pride and Prejudice'?",
        answers: ["Jane Austen", "Charlotte Bronte", "Emily Bronte", "Mary Shelley"],
        correctIndex: 0,
      },
      {
        text: "What is the main setting of 'Hamlet'?",
        answers: ["Denmark", "England", "Scotland", "Sweden"],
        correctIndex: 0,
      },
      {
        text: "Who wrote 'The Catcher in the Rye'?",
        answers: ["J.D. Salinger", "F. Scott Fitzgerald", "Ernest Hemingway", "Jack Kerouac"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Film",
    icon: "film",
    questions: [
      {
        text: "Who directed 'Inception'?",
        answers: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Quentin Tarantino"],
        correctIndex: 2,
      },
      {
        text: "Which movie won the first Academy Award for Best Picture?",
        answers: ["Wings", "Metropolis", "Sunrise", "The Jazz Singer"],
        correctIndex: 0,
      },
      {
        text: "What is the highest-grossing film of all time?",
        answers: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the kingdom in 'Frozen'?",
        answers: ["Arendelle", "Corona", "DunBroch", "Agrabah"],
        correctIndex: 0,
      },
      {
        text: "Which actor played Wolverine in the X-Men films?",
        answers: ["Hugh Jackman", "Christian Bale", "Robert Downey Jr.", "Chris Evans"],
        correctIndex: 0,
      },
      {
        text: "Who directed 'Jaws'?",
        answers: ["Steven Spielberg", "George Lucas", "Alfred Hitchcock", "Francis Ford Coppola"],
        correctIndex: 0,
      },
      {
        text: "What movie features the line 'Here's looking at you, kid'?",
        answers: ["Casablanca", "Citizen Kane", "Gone with the Wind", "The Wizard of Oz"],
        correctIndex: 0,
      },
      {
        text: "Which actor played Jack Dawson in 'Titanic'?",
        answers: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp", "Matt Damon"],
        correctIndex: 0,
      },
      {
        text: "What was the first feature-length animated movie?",
        answers: ["Snow White and the Seven Dwarfs", "Pinocchio", "Fantasia", "Dumbo"],
        correctIndex: 0,
      },
      {
        text: "Who played Neo in 'The Matrix'?",
        answers: ["Keanu Reeves", "Laurence Fishburne", "Hugo Weaving", "Matt Damon"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Music",
    icon: "music",
    questions: [
      {
        text: "Who is known as the King of Pop?",
        answers: ["Michael Jackson", "Elvis Presley", "Prince", "Freddie Mercury"],
        correctIndex: 0,
      },
      {
        text: "Which band released the album 'Abbey Road'?",
        answers: ["The Rolling Stones", "The Beatles", "Led Zeppelin", "Pink Floyd"],
        correctIndex: 1,
      },
      {
        text: "How many keys are on a standard piano?",
        answers: ["88", "85", "90", "76"],
        correctIndex: 0,
      },
      {
        text: "Which singer released the hit 'Rolling in the Deep'?",
        answers: ["Adele", "Taylor Swift", "Beyonce", "Rihanna"],
        correctIndex: 0,
      },
      {
        text: "What is the highest female singing voice?",
        answers: ["Soprano", "Alto", "Mezzo-Soprano", "Contralto"],
        correctIndex: 0,
      },
      {
        text: "Which classical composer was deaf?",
        answers: ["Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Franz Schubert"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the lead singer of U2?",
        answers: ["Bono", "The Edge", "Sting", "Morrissey"],
        correctIndex: 0,
      },
      {
        text: "How many strings are on a standard acoustic guitar?",
        answers: ["6", "4", "5", "12"],
        correctIndex: 0,
      },
      {
        text: "Who sang 'Purple Rain'?",
        answers: ["Prince", "Michael Jackson", "David Bowie", "Bruce Springsteen"],
        correctIndex: 0,
      },
      {
        text: "What is the national instrument of Scotland?",
        answers: ["Bagpipes", "Harp", "Accordion", "Flute"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Television",
    icon: "tv",
    questions: [
      {
        text: "Which TV show features the character Sheldon Cooper?",
        answers: ["Friends", "How I Met Your Mother", "Brooklyn Nine-Nine", "The Big Bang Theory"],
        correctIndex: 3,
      },
      {
        text: "What is the name of the fictional continent in 'Game of Thrones'?",
        answers: ["Westeros", "Essos", "Middle-earth", "Narnia"],
        correctIndex: 0,
      },
      {
        text: "Which animated series features Homer Simpson?",
        answers: ["Family Guy", "Futurama", "The Simpsons", "South Park"],
        correctIndex: 2,
      },
      {
        text: "Which series features the character Walter White?",
        answers: ["Breaking Bad", "Better Call Saul", "Mad Men", "Dexter"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the office building in 'The Office' (US)?",
        answers: ["Dunder Mifflin", "Wernham Hogg", "Sabre", "Initech"],
        correctIndex: 0,
      },
      {
        text: "In 'Doctor Who', what is the Doctor's time machine called?",
        answers: ["TARDIS", "DeLorean", "Phone Booth", "Starship"],
        correctIndex: 0,
      },
      {
        text: "Which show is set in the fictional town of Hawkins, Indiana?",
        answers: ["Stranger Things", "Twin Peaks", "Riverdale", "Supernatural"],
        correctIndex: 0,
      },
      {
        text: "Who hosted 'The Tonight Show' before Jimmy Fallon?",
        answers: ["Jay Leno", "Conan O'Brien", "David Letterman", "Johnny Carson"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the coffee shop in 'Friends'?",
        answers: ["Central Perk", "Monk's Cafe", "Luke's Diner", "MacLaren's"],
        correctIndex: 0,
      },
      {
        text: "Which show is about a theme park populated by robotic hosts?",
        answers: ["Westworld", "Humans", "Lost", "Black Mirror"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Video Games",
    icon: "gamepad",
    questions: [
      {
        text: "What is the best-selling video game of all time?",
        answers: ["Minecraft", "Tetris", "Grand Theft Auto V", "Wii Sports"],
        correctIndex: 0,
      },
      {
        text: "Who is the main protagonist of the Legend of Zelda series?",
        answers: ["Zelda", "Link", "Ganon", "Mario"],
        correctIndex: 1,
      },
      {
        text: "Which company created the character Sonic the Hedgehog?",
        answers: ["Nintendo", "Sega", "Sony", "Capcom"],
        correctIndex: 1,
      },
      {
        text: "What is the name of the main character in the 'Halo' series?",
        answers: ["Master Chief", "Arbiter", "Cortana", "Marcus Fenix"],
        correctIndex: 0,
      },
      {
        text: "Which game features the slogan 'Gotta Catch 'Em All'?",
        answers: ["Pokemon", "Yu-Gi-Oh", "Digimon", "Monster Hunter"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the fictional city in 'Bioshock'?",
        answers: ["Rapture", "Columbia", "Dunwall", "Midgar"],
        correctIndex: 0,
      },
      {
        text: "In 'Pac-Man', how many ghosts chase the player?",
        answers: ["4", "3", "5", "6"],
        correctIndex: 0,
      },
      {
        text: "Which company developed the 'Witcher' series?",
        answers: ["CD Projekt Red", "Bethesda", "Ubisoft", "BioWare"],
        correctIndex: 0,
      },
      {
        text: "What is the name of Mario's dinosaur companion?",
        answers: ["Yoshi", "Luigi", "Toad", "Bowser"],
        correctIndex: 0,
      },
      {
        text: "In which game do players fight in the battle royale mode on a map called 'Erangel'?",
        answers: ["PUBG", "Fortnite", "Apex Legends", "Warzone"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Mythology",
    icon: "scroll",
    questions: [
      {
        text: "Who is the Greek god of the sea?",
        answers: ["Zeus", "Hades", "Poseidon", "Ares"],
        correctIndex: 2,
      },
      {
        text: "In Norse mythology, what is the name of Thor's hammer?",
        answers: ["Mjolnir", "Gungnir", "Aegis", "Excalibur"],
        correctIndex: 0,
      },
      {
        text: "Who is the Egyptian god of the afterlife?",
        answers: ["Anubis", "Ra", "Osiris", "Horus"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the Roman equivalent of Zeus?",
        answers: ["Jupiter", "Neptune", "Mars", "Pluto"],
        correctIndex: 0,
      },
      {
        text: "Who is the goddess of love and beauty in Greek mythology?",
        answers: ["Aphrodite", "Athena", "Hera", "Artemis"],
        correctIndex: 0,
      },
      {
        text: "In Greek mythology, who flew too close to the sun?",
        answers: ["Icarus", "Daedalus", "Achilles", "Hercules"],
        correctIndex: 0,
      },
      {
        text: "What creature has the body of a lion and the head of a human?",
        answers: ["Sphinx", "Griffin", "Chimera", "Minotaur"],
        correctIndex: 0,
      },
      {
        text: "Who cut off the head of the Medusa?",
        answers: ["Perseus", "Theseus", "Hercules", "Jason"],
        correctIndex: 0,
      },
      {
        text: "In Norse mythology, what is the name of the underworld?",
        answers: ["Hel", "Valhalla", "Asgard", "Midgard"],
        correctIndex: 0,
      },
      {
        text: "What weapon is wielded by the Greek god Poseidon?",
        answers: ["Trident", "Lightning bolt", "Sword", "Bow"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Sports",
    icon: "trophy",
    questions: [
      {
        text: "How many players are on a soccer team on the field?",
        answers: ["10", "11", "12", "9"],
        correctIndex: 1,
      },
      {
        text: "Which country has won the most FIFA World Cups?",
        answers: ["Germany", "Italy", "Brazil", "Argentina"],
        correctIndex: 2,
      },
      {
        text: "In tennis, what term is used to describe a score of zero?",
        answers: ["Love", "Nil", "Zero", "Fault"],
        correctIndex: 0,
      },
      {
        text: "In which sport would you use a shuttlecock?",
        answers: ["Badminton", "Tennis", "Squash", "Ping Pong"],
        correctIndex: 0,
      },
      {
        text: "What is the distance of a standard marathon?",
        answers: ["26.2 miles", "13.1 miles", "10 miles", "30 miles"],
        correctIndex: 0,
      },
      {
        text: "How many rings are on the Olympic flag?",
        answers: ["5", "4", "6", "7"],
        correctIndex: 0,
      },
      {
        text: "Which basketball player is known as 'His Airness'?",
        answers: ["Michael Jordan", "LeBron James", "Kobe Bryant", "Shaquille O'Neal"],
        correctIndex: 0,
      },
      {
        text: "How many strikes make a strikeout in baseball?",
        answers: ["3", "4", "2", "5"],
        correctIndex: 0,
      },
      {
        text: "What is the highest score possible in a single turn of bowling?",
        answers: ["300", "100", "200", "150"],
        correctIndex: 0,
      },
      {
        text: "Which country won the first FIFA World Cup in 1930?",
        answers: ["Uruguay", "Argentina", "Brazil", "France"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Art",
    icon: "palette",
    questions: [
      {
        text: "Who painted the Mona Lisa?",
        answers: ["Leonardo da Vinci", "Michelangelo", "Vincent van Gogh", "Pablo Picasso"],
        correctIndex: 0,
      },
      {
        text: "Which art movement is Salvador Dali associated with?",
        answers: ["Impressionism", "Surrealism", "Cubism", "Expressionism"],
        correctIndex: 1,
      },
      {
        text: "What is the primary color that is NOT red or blue?",
        answers: ["Green", "Orange", "Yellow", "Purple"],
        correctIndex: 2,
      },
      {
        text: "Who painted 'The Starry Night'?",
        answers: ["Vincent van Gogh", "Claude Monet", "Pablo Picasso", "Rembrandt"],
        correctIndex: 0,
      },
      {
        text: "Which country is the artist Frida Kahlo from?",
        answers: ["Mexico", "Spain", "Colombia", "Italy"],
        correctIndex: 0,
      },
      {
        text: "What art technique uses small dots of color to form an image?",
        answers: ["Pointillism", "Impressionism", "Surrealism", "Cubism"],
        correctIndex: 0,
      },
      {
        text: "Who sculpted 'David'?",
        answers: ["Michelangelo", "Leonardo da Vinci", "Donatello", "Bernini"],
        correctIndex: 0,
      },
      {
        text: "What type of paint is made from pigments mixed with water-soluble binder?",
        answers: ["Watercolor", "Acrylic", "Oil", "Tempera"],
        correctIndex: 0,
      },
      {
        text: "What art movement did Andy Warhol lead?",
        answers: ["Pop Art", "Dadaism", "Abstract Expressionism", "Modernism"],
        correctIndex: 0,
      },
      {
        text: "Who painted 'The Scream'?",
        answers: ["Edvard Munch", "Gustav Klimt", "Egon Schiele", "Henri Matisse"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Animals",
    icon: "paw",
    questions: [
      {
        text: "What is the largest mammal in the world?",
        answers: ["African Elephant", "Blue Whale", "Fin Whale", "Sperm Whale"],
        correctIndex: 1,
      },
      {
        text: "Which bird is known for its ability to mimic human speech?",
        answers: ["Crow", "Owl", "Parrot", "Eagle"],
        correctIndex: 2,
      },
      {
        text: "How many hearts does an octopus have?",
        answers: ["1", "2", "3", "4"],
        correctIndex: 2,
      },
      {
        text: "What is the fastest land animal?",
        answers: ["Cheetah", "Pronghorn", "Lion", "Horse"],
        correctIndex: 0,
      },
      {
        text: "Which bird cannot fly?",
        answers: ["Penguin", "Eagle", "Hawk", "Falcon"],
        correctIndex: 0,
      },
      {
        text: "What is a group of lions called?",
        answers: ["Pride", "Pack", "Herd", "Flock"],
        correctIndex: 0,
      },
      {
        text: "What is the only mammal capable of true flight?",
        answers: ["Bat", "Flying Squirrel", "Sugar Glider", "Eagle"],
        correctIndex: 0,
      },
      {
        text: "What kind of animal is a Komodo dragon?",
        answers: ["Lizard", "Snake", "Crocodile", "Turtle"],
        correctIndex: 0,
      },
      {
        text: "What is the lifespan of a giant tortoise?",
        answers: ["Over 100 years", "20 years", "50 years", "150 years"],
        correctIndex: 0,
      },
      {
        text: "Which animal is known as the 'Ship of the Desert'?",
        answers: ["Camel", "Horse", "Donkey", "Llama"],
        correctIndex: 0,
      },
    ],
  },
  {
    name: "Vehicles",
    icon: "car",
    questions: [
      {
        text: "Which company manufactured the Model T car?",
        answers: ["Chevrolet", "Dodge", "Toyota", "Ford"],
        correctIndex: 3,
      },
      {
        text: "What is the primary fuel used in commercial airplanes?",
        answers: ["Gasoline", "Diesel", "Jet Fuel", "Ethanol"],
        correctIndex: 2,
      },
      {
        text: "Which Italian brand is famous for its prancing horse logo?",
        answers: ["Ferrari", "Lamborghini", "Maserati", "Alfa Romeo"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the electric car company founded by Elon Musk?",
        answers: ["Tesla", "Rivian", "Lucid", "Toyota"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the first successful supersonic passenger airliner?",
        answers: ["Concorde", "Boeing 747", "Airbus A380", "Tupolev Tu-144"],
        correctIndex: 0,
      },
      {
        text: "Which country is home to the high-speed Shinkansen (bullet train)?",
        answers: ["Japan", "China", "France", "Germany"],
        correctIndex: 0,
      },
      {
        text: "What is the name of the vehicle used by astronauts to drive on the Moon?",
        answers: ["Lunar Roving Vehicle", "Apollo Rover", "Space Buggy", "Moon Lander"],
        correctIndex: 0,
      },
      {
        text: "What does 'SUV' stand for?",
        answers: ["Sports Utility Vehicle", "Standard Utility Vehicle", "Super Utility Vehicle", "Special Urban Vehicle"],
        correctIndex: 0,
      },
      {
        text: "What company produces the 'Civic' and 'Accord' models?",
        answers: ["Honda", "Toyota", "Hyundai", "Nissan"],
        correctIndex: 0,
      },
      {
        text: "Which country manufactures the luxury car brand Porsche?",
        answers: ["Germany", "Italy", "United Kingdom", "Japan"],
        correctIndex: 0,
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
