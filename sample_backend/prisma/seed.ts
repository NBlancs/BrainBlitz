import prisma from "../src/lib/prisma.js";

type SeedQuestion = {
  text: string;
  answers: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  country: "PHILIPPINES" | "UNITED_STATES" | "GREAT_BRITAIN" | "CHINA" | "JAPAN" | "SOUTH_KOREA";
};

type SeedCategory = {
  name: string;
  icon: string;
};

const categories: SeedCategory[] = [
  { name: "Science", icon: "microscope" },
  { name: "History", icon: "landmark" },
  { name: "Geography", icon: "globe" },
  { name: "Mythology", icon: "scroll" },
  { name: "Art", icon: "palette" },
  { name: "Animals", icon: "paw" },
];

// Helper to define 10 questions (4 Easy, 3 Medium, 3 Hard) for a country and category
const questionBank: SeedQuestion[] = [
  // ==========================================
  // SCIENCE
  // ==========================================
  // --- Philippines ---
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What is the name of the first micro-satellite built and designed by Filipinos, launched in 2016?",
    answers: ["Diwata-1", "Agila-1", "Maya-1", "Katipunan-1"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Which volcanic eruption in the Philippines in 1991 was the second-largest terrestrial eruption of the 20th century?",
    answers: ["Mount Mayon", "Mount Pinatubo", "Taal Volcano", "Mount Kanlaon"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What plant, commonly grown in the Philippines, is known as the 'Tree of Life' due to its various uses?",
    answers: ["Mango Tree", "Coconut Palm", "Banana Plant", "Bamboo"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What active volcano in Albay is famous worldwide for its almost symmetric 'perfect cone' shape?",
    answers: ["Taal Volcano", "Mount Mayon", "Mount Apo", "Mount Pulag"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Which Filipino scientist is credited with inventing the medical incubator made of bamboo for rural areas?",
    answers: ["Fe Del Mundo", "Angel Alcala", "Maria Orosa", "Gregorio Zara"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Which Filipino scientist isolated the antibiotic erythromycin from a soil sample in Iloilo?",
    answers: ["Eduardo Quisumbing", "Abelardo Aguilar", "Paulo Campos", "Julian Banzon"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "What popular Filipino condiment was invented by food technologist Maria Orosa during WWII?",
    answers: ["Banana Ketchup", "Fish Sauce (Patis)", "Shrimp Paste (Bagoong)", "Soy Sauce (Toyo)"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "What government project was launched in 2012 by the DOST as a nationwide disaster prevention and mitigation system?",
    answers: ["Project NOAH", "Project AGILA", "Project LIWANAG", "Project LUNAS"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Which marine sanctuary in the Sulu Sea is recognized as a UNESCO World Heritage Site for its incredible biodiversity?",
    answers: ["Apo Reef", "Tubbataha Reefs Natural Park", "El Nido Marine Reserve", "Coron Bay Sanctuary"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Which Filipino botanist is widely regarded as the leading authority on Philippine medicinal plants and orchids?",
    answers: ["Julian Banzon", "Eduardo Quisumbing", "Ramon Barba", "Gregorio Velasquez"], correctIndex: 1
  },

  // --- United States ---
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which American agency is responsible for civil space programs, aeronautics, and space research?",
    answers: ["ESA", "NASA", "Roscosmos", "SpaceX"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which American inventor holds over 1,000 patents, including those for the light bulb and phonograph?",
    answers: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Albert Einstein"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What is the name of the first space shuttle launched by NASA in 1981?",
    answers: ["Challenger", "Discovery", "Columbia", "Atlantis"], correctIndex: 2
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What iconic American national park contains the supervolcano and geothermal geyser named 'Old Faithful'?",
    answers: ["Yosemite", "Yellowstone", "Grand Canyon", "Zion"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which US physicist led the Manhattan Project's Los Alamos Laboratory during the development of the atomic bomb?",
    answers: ["Richard Feynman", "J. Robert Oppenheimer", "Enrico Fermi", "Albert Einstein"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "What was the name of the famous American scientist and agriculturalist who discovered over 100 uses for peanuts?",
    answers: ["George Washington Carver", "Benjamin Franklin", "John Muir", "Luther Burbank"], correctIndex: 0
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which American private enterprise launched the Crew Dragon spacecraft to carry astronauts to the ISS?",
    answers: ["Boeing", "SpaceX", "Blue Origin", "Virgin Galactic"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which US geologist first proposed the theory of seafloor spreading, which laid the foundation for plate tectonics?",
    answers: ["Harry Hess", "Alfred Wegener", "Charles Richter", "James Dwight Dana"], correctIndex: 0
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "What major scientific laboratory in Illinois is home to the Tevatron, a defunct high-energy particle accelerator?",
    answers: ["Oak Ridge", "Fermilab", "Lawrence Berkeley", "Brookhaven"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which US marine biologist and conservationist wrote the groundbreaking book 'Silent Spring' in 1962?",
    answers: ["Sylvia Earle", "Rachel Carson", "Jane Goodall", "Dian Fossey"], correctIndex: 1
  },

  // --- Great Britain ---
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which British scientist formulated the laws of motion and universal gravitation?",
    answers: ["Charles Darwin", "Sir Isaac Newton", "Stephen Hawking", "Michael Faraday"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which British naturalist proposed the theory of evolution by natural selection in 1859?",
    answers: ["Gregor Mendel", "Charles Darwin", "Alfred Russel Wallace", "Richard Dawkins"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Who was the British physician who discovered penicillin in 1928?",
    answers: ["Alexander Fleming", "Edward Jenner", "Joseph Lister", "Robert Koch"], correctIndex: 0
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which British theoretical physicist wrote the best-selling book 'A Brief History of Time'?",
    answers: ["Roger Penrose", "Stephen Hawking", "Brian Cox", "Peter Higgs"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Which British chemist and DNA researcher contributed to the discovery of the double helix structure of DNA?",
    answers: ["Rosalind Franklin", "Marie Curie", "Dorothy Hodgkin", "Jane Marcet"], correctIndex: 0
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Who is the British scientist credited with developing the World Wide Web in 1989?",
    answers: ["Alan Turing", "Tim Berners-Lee", "Charles Babbage", "Ada Lovelace"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Which British pioneer developed the first successful vaccine, which was for smallpox in 1796?",
    answers: ["Alexander Fleming", "Edward Jenner", "Joseph Lister", "John Snow"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which British physicist and chemist discovered electromagnetic induction and invented the electric motor?",
    answers: ["James Clerk Maxwell", "Michael Faraday", "Lord Kelvin", "Ernest Rutherford"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which British scientist predicted the existence of the Higgs boson particle in 1964?",
    answers: ["Stephen Hawking", "Peter Higgs", "Paul Dirac", "J.J. Thomson"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "What was the name of the first cloned mammal, a sheep cloned by scientists in Scotland in 1996?",
    answers: ["Molly", "Dolly", "Polly", "Lolly"], correctIndex: 1
  },

  // --- China ---
  {
    country: "CHINA", difficulty: "EASY", text: "Which of these is NOT one of the 'Four Great Inventions' of ancient China?",
    answers: ["Gunpowder", "Papermaking", "Printing", "The Telescope"], correctIndex: 3
  },
  {
    country: "CHINA", difficulty: "EASY", text: "Which Chinese space exploration program is responsible for sending robotic rovers and landing missions to the Moon?",
    answers: ["Shenzhou", "Tiangong", "Chang'e", "Tianwen"], correctIndex: 2
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What is the name of China's permanently crewed modular space station, completed in 2022?",
    answers: ["Shenzhou-1", "Tiangong", "Chang'e-5", "Dongfanghong-1"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What traditional Chinese medical practice uses thin needles inserted into specific body points to relieve pain?",
    answers: ["Herbalism", "Acupuncture", "Cupping", "Tai Chi"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which Chinese scientist won the 2015 Nobel Prize in Medicine for discovering artemisinin, a breakthrough malaria drug?",
    answers: ["Tu Youyou", "Yuan Longping", "Shi Yigong", "Zhong Nanshan"], correctIndex: 0
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Who was the Chinese agronomist known as the 'Father of Hybrid Rice' for developing high-yield rice strains in the 1970s?",
    answers: ["Tu Youyou", "Yuan Longping", "Qian Xuesen", "Min Chueh Chang"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which ancient Chinese scientist and mathematician calculated the value of pi (π) to seven decimal places in the 5th century?",
    answers: ["Zu Chongzhi", "Shen Kuo", "Zhang Heng", "Sun Tzu"], correctIndex: 0
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which Chinese aerospace engineer is widely considered the 'Father of Chinese Rocketry' and space program?",
    answers: ["Qian Xuesen", "Yuan Longping", "Wang Xiji", "Sun Jiadong"], correctIndex: 0
  },
  {
    country: "CHINA", difficulty: "HARD", text: "What ancient Chinese invention, described by Zhang Heng in 132 CE, was the world's first seismoscope to detect earthquakes?",
    answers: ["Didong Yi", "Abacus", "South-Pointing Chariot", "Sundial"], correctIndex: 0
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which Chinese polymath of the Song Dynasty wrote 'Dream Pool Essays' documenting early discoveries in magnetic compasses and geology?",
    answers: ["Zu Chongzhi", "Shen Kuo", "Guo Shoujing", "Zhang Heng"], correctIndex: 1
  },

  // --- Japan ---
  {
    country: "JAPAN", difficulty: "EASY", text: "What is the name of Japan's national aerospace exploration agency?",
    answers: ["JAXA", "ESA", "CNSA", "NASA"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "Which Japanese automobile manufacturer is a pioneer in hybrid technology with the Prius?",
    answers: ["Honda", "Nissan", "Toyota", "Subaru"], correctIndex: 2
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What is the name of the high-speed passenger rail network in Japan, famous for its bullet trains?",
    answers: ["Shinkansen", "Yamanote", "Maglev", "Nozomi"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What active stratovolcano is the highest mountain in Japan and a sacred natural landmark?",
    answers: ["Mount Aso", "Mount Fuji", "Mount Kita", "Mount Tate"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Which Japanese scientist won the 2012 Nobel Prize for discovering how to create induced pluripotent stem cells (iPS)?",
    answers: ["Shinya Yamanaka", "Yoshinori Ohsumi", "Tasuku Honjo", "Hideki Yukawa"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What Japanese electronics giant is credited with developing and releasing the first portable audio cassette player, the Walkman, in 1979?",
    answers: ["Panasonic", "Sony", "Toshiba", "Sharp"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Which Japanese theoretical physicist was the first Japanese Nobel laureate, winning in 1949 for predicting mesons?",
    answers: ["Hideki Yukawa", "Shinichiro Tomonaga", "Leo Esaki", "Ryoji Noyori"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which Japanese scientist won the 2016 Nobel Prize for his discoveries of mechanisms for autophagy (cell self-eating)?",
    answers: ["Yoshinori Ohsumi", "Shinya Yamanaka", "Tasuku Honjo", "Akira Yoshino"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "What is the name of the Japanese supercomputer developed by RIKEN and Fujitsu that was ranked the world's fastest from 2020 to 2022?",
    answers: ["K Computer", "Fugaku", "Sunway TaihuLight", "Summit"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which Japanese chemist is co-credited with inventing the lithium-ion battery, earning a Nobel Prize in 2019?",
    answers: ["Akira Yoshino", "Ryoji Noyori", "Koichi Tanaka", "Kenichi Fukui"], correctIndex: 0
  },

  // --- South Korea ---
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "Which South Korean tech multinational is the world's largest manufacturer of smartphones and memory chips?",
    answers: ["LG", "Hyundai", "Samsung", "SK Hynix"], correctIndex: 2
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the name of South Korea's first lunar orbiter, launched in 2022?",
    answers: ["Danuri", "Nuri", "KSLV-II", "Arirang"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the name of South Korea's space agency, established to coordinate aeronautics research?",
    answers: ["KARI", "JAXA", "CNSA", "NASA"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "Which South Korean company is a global leader in home appliances and OLED display panels?",
    answers: ["Samsung", "LG Electronics", "Hyundai", "Daewoo"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What is the name of South Korea's first domestically designed and built space launch vehicle, which succeeded in 2022?",
    answers: ["Naro-1", "Nuri (KSLV-II)", "Cheollian", "Gwangmyeongseong"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "Which South Korean research institute is famous for building KSTAR, the superconducting nuclear fusion research device?",
    answers: ["KAIST", "Korea Institute of Fusion Energy", "KARI", "ETRI"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What is the acronym of the prestigious South Korea public research university located in Daejeon, known for science and engineering?",
    answers: ["SNU", "KAIST", "POSTECH", "SKY"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "What is the name of South Korea's advanced nuclear fusion device, often called the 'Korean Artificial Sun'?",
    answers: ["KSTAR", "EAST", "ITER", "JT-60SA"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which Korean scientist developed the first vaccine against Hantavirus (Hantaan river virus) in 1990?",
    answers: ["Lee Ho-wang", "Hwang Woo-suk", "Seo Jung-jin", "Woo Jang-choon"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which South Korean agricultural scientist developed hybrid seeds of disease-resistant cabbages and radishes in the 1950s?",
    answers: ["Woo Jang-choon", "Lee Ho-wang", "Hwang Woo-suk", "Kim Soon-kwon"], correctIndex: 0
  },

  // ==========================================
  // HISTORY
  // ==========================================
  // --- Philippines ---
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Who is the national hero of the Philippines, who wrote the novels 'Noli Me Tangere' and 'El Filibusterismo'?",
    answers: ["Andres Bonifacio", "Jose Rizal", "Emilio Aguinaldo", "Apolinario Mabini"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "In what year did the Portuguese explorer Ferdinand Magellan arrive in the Philippines?",
    answers: ["1521", "1898", "1946", "1565"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Who was the first President of the Philippine Republic, who declared independence in Kawit, Cavite?",
    answers: ["Manuel Quezon", "Emilio Aguinaldo", "Jose P. Laurel", "Andres Bonifacio"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What revolutionary group was founded by Andres Bonifacio to fight for independence from Spain?",
    answers: ["La Liga Filipina", "Katipunan (KKK)", "Hukbalahap", "Nacionalista Party"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Who was the chief chieftain of Mactan who defeated Ferdinand Magellan in the Battle of Mactan in 1521?",
    answers: ["Humabon", "Lapulapu", "Sikatuna", "Dagohoy"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "What tragic event during WWII involved the forced transfer of Filipino and American prisoners of war from Mariveles to Capas?",
    answers: ["Bataan Death March", "Battle of Corregidor", "Manila Massacre", "Battle of Bessang Pass"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Which Philippine President signed Proclamation No. 1081 placing the country under Martial Law in September 1972?",
    answers: ["Ferdinand Marcos Sr.", "Diosdado Macapagal", "Ramon Magsaysay", "Corazon Aquino"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "How much did the United States pay to Spain for the purchase of the Philippines under the 1898 Treaty of Paris?",
    answers: ["$10 Million", "$20 Million", "$50 Million", "$100 Million"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "What event in August 1896 marked the official start of the Philippine Revolution, where Katipuneros tore their tax certificates?",
    answers: ["Cry of Pugad Lawin", "Battle of Pinaglabanan", "Tejeros Convention", "Execution of Gomburza"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Who was the Filipino general known as the 'Hero of Tirad Pass' who delayed American forces during the Philippine-American War?",
    answers: ["Antonio Luna", "Gregorio del Pilar", "Macario Sakay", "Miguel Malvar"], correctIndex: 1
  },

  // --- United States ---
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Who was the first President of the United States?",
    answers: ["Thomas Jefferson", "George Washington", "John Adams", "Abraham Lincoln"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which war was fought between the Northern and Southern states of the U.S. from 1861 to 1865?",
    answers: ["American Revolutionary War", "War of 1812", "American Civil War", "World War I"], correctIndex: 2
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which President issued the Emancipation Proclamation and led the U.S. during the Civil War?",
    answers: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "Theodore Roosevelt"], correctIndex: 2
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What document was adopted on July 4, 1776, declaring the thirteen colonies free from British rule?",
    answers: ["The U.S. Constitution", "The Declaration of Independence", "The Bill of Rights", "Articles of Confederation"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which amendment to the U.S. Constitution granted women the right to vote in 1920?",
    answers: ["18th Amendment", "19th Amendment", "21st Amendment", "22nd Amendment"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "What 1930s economic program was launched by President Franklin D. Roosevelt to rescue the U.S. from the Great Depression?",
    answers: ["The New Deal", "The Great Society", "Fair Deal", "New Frontier"], correctIndex: 0
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which U.S. civil rights leader delivered the famous 'I Have a Dream' speech during the 1963 March on Washington?",
    answers: ["Malcolm X", "Martin Luther King Jr.", "John Lewis", "Rosa Parks"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "What was the name of the first permanent English settlement established in North America in 1607?",
    answers: ["Plymouth", "Jamestown", "Roanoke", "Boston"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Who was the lead U.S. negotiator who drafted the Treaty of Paris in 1783, ending the Revolutionary War?",
    answers: ["John Adams", "Benjamin Franklin", "Thomas Jefferson", "John Jay"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "What 1794 rebellion in Pennsylvania was the first major test of the U.S. federal government's authority to enforce tax laws?",
    answers: ["Shays' Rebellion", "Whiskey Rebellion", "Bacon's Rebellion", "Nat Turner's Rebellion"], correctIndex: 1
  },

  // --- Great Britain ---
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which English queen ruled for 63 years during the height of the British Empire in the 19th century?",
    answers: ["Queen Elizabeth I", "Queen Victoria", "Queen Anne", "Queen Mary I"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Who was the British Prime Minister during most of World War II, famous for his speech victories?",
    answers: ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Margaret Thatcher"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which famous charter of liberties was signed by King John at Runnymede in 1215?",
    answers: ["Bill of Rights", "Magna Carta", "Act of Union", "Habeas Corpus Act"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which Tudor monarch broke away from the Roman Catholic Church and married six times?",
    answers: ["Henry VIII", "Henry VII", "Edward VI", "Richard III"], correctIndex: 0
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "In what year did the Great Fire of London destroy much of the city, including St. Paul's Cathedral?",
    answers: ["1666", "1588", "1605", "1715"], correctIndex: 0
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Who was the first female Prime Minister of Great Britain, serving from 1979 to 1990?",
    answers: ["Theresa May", "Margaret Thatcher", "Liz Truss", "Queen Elizabeth II"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Which naval battle in 1805 saw Admiral Lord Nelson defeat the combined French and Spanish fleets?",
    answers: ["Battle of Waterloo", "Battle of Trafalgar", "Battle of Agincourt", "Battle of Hastings"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Who was the first de facto Prime Minister of Great Britain, serving from 1721 to 1742?",
    answers: ["Robert Walpole", "William Pitt the Elder", "Lord North", "Benjamin Disraeli"], correctIndex: 0
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "What conflict was fought in England between the Royalists and the Parliamentarians from 1642 to 1651?",
    answers: ["War of the Roses", "English Civil War", "Hundred Years' War", "Glorious Revolution"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which King of England was executed by beheading in 1649 following the English Civil War?",
    answers: ["Charles I", "James I", "Charles II", "James II"], correctIndex: 0
  },

  // --- China ---
  {
    country: "CHINA", difficulty: "EASY", text: "Who was the first Emperor of a unified China, who built the Terracotta Army?",
    answers: ["Han Wudi", "Qin Shi Huang", "Tang Taizong", "Kublai Khan"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What major trade route linked China with the West during the Han Dynasty?",
    answers: ["Grand Canal", "Silk Road", "Spice Route", "Tea Horse Road"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What massive defensive structure was built across northern China to protect against nomadic invasions?",
    answers: ["The Forbidden City", "The Great Wall of China", "The Grand Canal", "The Terracotta Wall"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "Which political leader founded the People's Republic of China on October 1, 1949?",
    answers: ["Sun Yat-sen", "Chiang Kai-shek", "Mao Zedong", "Deng Xiaoping"], correctIndex: 2
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which Chinese dynasty is widely considered the golden age of poetry, culture, and cosmopolitan trade?",
    answers: ["Qin Dynasty", "Han Dynasty", "Tang Dynasty", "Ming Dynasty"], correctIndex: 2
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Who was the Chinese revolutionary leader known as the 'Father of modern China' for overthrowing the Qing Dynasty in 1911?",
    answers: ["Mao Zedong", "Sun Yat-sen", "Chiang Kai-shek", "Deng Xiaoping"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "What 19th-century conflicts between China and Britain were fought over trade rights and led to the ceding of Hong Kong?",
    answers: ["Opium Wars", "Taiping Rebellion", "Boxer Rebellion", "Sino-French War"], correctIndex: 0
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which Chinese admiral led seven massive maritime expeditions to Southeast Asia, South Asia, and East Africa in the early 15th century?",
    answers: ["Zheng He", "Yue Fei", "Qi Jiguang", "Sima Yi"], correctIndex: 0
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which Chinese empress was the only female emperor in Chinese history to rule in her own right?",
    answers: ["Empress Dowager Cixi", "Wu Zetian", "Empress Lu", "Empress Wang"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "What massive 1850s rebellion, led by Hong Xiuquan who claimed to be the brother of Jesus, resulted in millions of deaths?",
    answers: ["White Lotus Rebellion", "Taiping Rebellion", "Boxer Rebellion", "Nian Rebellion"], correctIndex: 1
  },

  // --- Japan ---
  {
    country: "JAPAN", difficulty: "EASY", text: "What was the name of the military commanders who ruled feudal Japan from the 12th to the 19th century?",
    answers: ["Samurai", "Shogun", "Daimyo", "Mikado"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What is the name of the warrior class of elite military nobility in feudal Japan?",
    answers: ["Ninja", "Samurai", "Ronin", "Ashigaru"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "Which Japanese city became the first city to be targeted by an atomic bomb on August 6, 1945?",
    answers: ["Tokyo", "Nagasaki", "Hiroshima", "Kyoto"], correctIndex: 2
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What is the name of the historic era (1868-1912) that marked Japan's rapid modernization and return to imperial rule?",
    answers: ["Meiji Restoration", "Edo Period", "Sengoku Jidai", "Heian Period"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Who was the powerful daimyo who initiated the unification of Japan in the late 16th century, ended by Battle of Sekigahara?",
    answers: ["Oda Nobunaga", "Toyotomi Hideyoshi", "Tokugawa Ieyasu", "Takeda Shingen"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What was the name of the shogunate that ruled Japan during the peaceful Edo period from 1603 to 1867?",
    answers: ["Kamakura Shogunate", "Ashikaga Shogunate", "Tokugawa Shogunate", "Minamoto Shogunate"], correctIndex: 2
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Which Japanese capital was the center of imperial court culture during the Heian period (794-1185)?",
    answers: ["Nara", "Kyoto (Heian-kyo)", "Kamakura", "Tokyo"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "What 1274 and 1281 invasions of Japan by Kublai Khan were thwarted by typhoons later named 'kamikaze'?",
    answers: ["Mongol Invasions", "Jurchen Invasions", "Ming Invasions", "Sui Invasions"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which Japanese diplomat in Lithuania saved thousands of Jews during WWII by issuing transit visas to Japan?",
    answers: ["Chiune Sugihara", "Hideki Tojo", "Koki Hirota", "Fumimaro Konoe"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "What 1877 rebellion of samurai in Satsuma, led by Saigo Takamori, was the final armed conflict against the Meiji government?",
    answers: ["Boshin War", "Satsuma Rebellion", "Shimabara Rebellion", "Saga Rebellion"], correctIndex: 1
  },

  // --- South Korea ---
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "Which Joseon Dynasty king created Hangul, the Korean alphabet, in 1443?",
    answers: ["King Taejo", "King Sejong the Great", "King Gwanghaegun", "King Gojong"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What major conflict divided the Korean Peninsula along the 38th parallel in 1950?",
    answers: ["Sino-Korean War", "Korean War", "Russo-Japanese War", "Imjin War"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What was the ancient name of the three kingdoms of Korea before unification?",
    answers: ["Joseon", "Goguryeo, Baekje, and Silla", "Goryeo", "Balhae"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the name of the treaty or agreement that halted active combat in the Korean War in 1953?",
    answers: ["Treaty of Versailles", "Korean Armistice Agreement", "Treaty of Portsmouth", "Seoul Accord"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "Which Korean admiral invented the turtle ship ('Geobukseon') and defeated Japanese forces at the Battle of Myeongnyang?",
    answers: ["Admiral Yi Sun-sin", "General Kim Yu-sin", "King Munmu", "General Eulji Mundeok"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "Which dynasty, ruling from 918 to 1392, gave Korea its English name?",
    answers: ["Joseon Dynasty", "Goryeo Dynasty", "Silla Dynasty", "Balhae Dynasty"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What major student-led democratic uprising took place in Gwangju in May 1980?",
    answers: ["April Revolution", "Gwangju Uprising", "June Democracy Movement", "Donghak Rebellion"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which queen ruled Silla as its first reigning queen, patronizing astronomy and building Cheomseongdae?",
    answers: ["Queen Seondeok", "Queen Jindeok", "Queen Jinseong", "Queen Min"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "What 1919 peaceful nationwide demonstration in Korea protested against Japanese colonial rule?",
    answers: ["Gwangju Student Movement", "March 1st Movement", "June 10th Movement", "Donghak Peasant Revolution"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which Korean kingdom successfully allied with the Chinese Tang Dynasty to achieve the first unification of Korea in 676 CE?",
    answers: ["Silla", "Goguryeo", "Baekje", "Gaya"], correctIndex: 0
  },

  // ==========================================
  // GEOGRAPHY
  // ==========================================
  // --- Philippines ---
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What is the capital city of the Philippines?",
    answers: ["Quezon City", "Manila", "Cebu City", "Davao City"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Which world-famous white-sand beach destination is located in Aklan province?",
    answers: ["El Nido", "Boracay", "Siargao", "Panglao"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What geological formation in Bohol consists of over 1,200 dome-shaped hills that turn brown in the dry season?",
    answers: ["Mayon Volcano", "Chocolate Hills", "Rice Terraces", "Mount Pinatubo"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What is the largest and most populous island group in the Philippines?",
    answers: ["Visayas", "Mindanao", "Luzon", "Palawan"], correctIndex: 2
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "What is the name of the bridge that connects the islands of Samar and Leyte, the longest bridge along the Pan-Philippine Highway?",
    answers: ["San Juanico Bridge", "Marcelo Fernan Bridge", "Cebu-Cordova Link Expressway", "Mactan Bridge"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "What is the longest river in the Philippines, flowing through the Cagayan Valley?",
    answers: ["Pasig River", "Cagayan River", "Pampanga River", "Agusan River"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "What is the highest mountain peak in the Philippines, located in Mindanao?",
    answers: ["Mount Pulag", "Mount Apo", "Mount Mayon", "Mount Dulang-dulang"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Which mountain range in Luzon is the longest mountain range in the Philippines?",
    answers: ["Cordillera Central", "Sierra Madre", "Caraballo Mountains", "Zambales Mountains"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "What natural wonder in Palawan is a UNESCO World Heritage Site featuring an 8.2 km navigable underground river?",
    answers: ["Apo Reef", "Puerto Princesa Subterranean River", "So hoton Caves", "Coron Lagoon"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "What strait in the Philippines is considered the 'center of the center' of global marine shorefish biodiversity?",
    answers: ["San Bernardino Strait", "Verde Island Passage", "Surigao Strait", "Tablas Strait"], correctIndex: 1
  },

  // --- United States ---
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What is the capital city of the United States?",
    answers: ["New York City", "Washington, D.C.", "Los Angeles", "Chicago"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which U.S. state is the largest by land area?",
    answers: ["Texas", "California", "Alaska", "Montana"], correctIndex: 2
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "In which U.S. state is the Grand Canyon located?",
    answers: ["Nevada", "Utah", "Arizona", "Colorado"], correctIndex: 2
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What river is the longest river system in North America, flowing into the Gulf of Mexico?",
    answers: ["Colorado River", "Mississippi River", "Hudson River", "Columbia River"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which of the Great Lakes is the largest by surface area and completely bordered by the US and Canada?",
    answers: ["Lake Michigan", "Lake Superior", "Lake Huron", "Lake Erie"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "What is the highest mountain peak in the United States, located in Alaska?",
    answers: ["Mount Whitney", "Mount Denali", "Mount Rainier", "Mount Elbert"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "What marshy national park in Florida is the largest subtropical wilderness in the United States?",
    answers: ["Yellowstone", "Everglades National Park", "Great Smoky Mountains", "Yosemite"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which US state has the longest coastline, stretching over 6,600 miles?",
    answers: ["Florida", "California", "Alaska", "Hawaii"], correctIndex: 2
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which gorge along the Columbia River forms the boundary between Washington and Oregon?",
    answers: ["Columbia River Gorge", "Hells Canyon", "Kings Canyon", "Zion Canyon"], correctIndex: 0
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "What desert covers parts of California, Nevada, Utah, and Arizona, containing Death Valley?",
    answers: ["Sonoran Desert", "Mojave Desert", "Chihuahuan Desert", "Great Basin Desert"], correctIndex: 1
  },

  // --- Great Britain ---
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What is the capital city of Great Britain?",
    answers: ["Edinburgh", "London", "Cardiff", "Belfast"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which river flows through London, under the Tower Bridge?",
    answers: ["River Severn", "River Thames", "River Mersey", "River Clyde"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What is the highest mountain in Scotland and the entire United Kingdom?",
    answers: ["Snowdon", "Ben Nevis", "Scafell Pike", "Slieve Donard"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which country is NOT part of the island of Great Britain?",
    answers: ["Scotland", "Wales", "Northern Ireland", "England"], correctIndex: 2
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "What body of water separates southern England from northern France?",
    answers: ["North Sea", "Irish Sea", "English Channel", "Celtic Sea"], correctIndex: 2
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "What is the largest lake (loch) by surface area in Great Britain, located in Scotland?",
    answers: ["Loch Ness", "Loch Lomond", "Windermere", "Loch Tay"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "What geological formation in Northern Ireland features 40,000 interlocking basalt columns?",
    answers: ["White Cliffs of Dover", "Giant's Causeway", "Cheddar Gorge", "Fingal's Cave"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "What is the longest river in the United Kingdom, flowing through Wales and England?",
    answers: ["River Thames", "River Severn", "River Trent", "River Ouse"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which national park in England contains the country's highest peak, Scafell Pike?",
    answers: ["Peak District", "Lake District", "Snowdonia", "Yorkshire Dales"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which archipelago of islands lies off the far north coast of mainland Scotland?",
    answers: ["Shetland Islands", "Orkney Islands", "Hebrides", "Isle of Wight"], correctIndex: 1
  },

  // --- China ---
  {
    country: "CHINA", difficulty: "EASY", text: "What is the capital city of China?",
    answers: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "Which river is the longest river in China and Asia?",
    answers: ["Yellow River", "Yangtze River", "Pearl River", "Mekong River"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What mountain range forms the natural border between China (Tibet) and Nepal?",
    answers: ["Tianshan", "Kunlun", "Himalayas", "Altai"], correctIndex: 2
  },
  {
    country: "CHINA", difficulty: "EASY", text: "Which Chinese city is the most populous and a major global financial hub located on the Yangtze delta?",
    answers: ["Beijing", "Shanghai", "Chengdu", "Chongqing"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "What is the name of the world's longest artificial river or canal, built starting in the Sui Dynasty?",
    answers: ["Grand Canal", "Yangtze Canal", "Yellow River Canal", "Red Flag Canal"], correctIndex: 0
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "What karst landscape in Guangxi is famous for its dramatic limestone hills along the Li River?",
    answers: ["Stone Forest", "Guilin", "Zhangjiajie", "Jiuzhaigou"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which high-altitude plateau in southwestern China is often called the 'Roof of the World'?",
    answers: ["Loess Plateau", "Tibetan Plateau", "Yunnan-Guizhou Plateau", "Inner Mongolian Plateau"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "What scenic area in Hunan province features thousands of towering sandstone pillars, inspiring the movie Avatar?",
    answers: ["Jiuzhaigou Valley", "Wulingyuan (Zhangjiajie)", "Mount Huangshan", "Mount Emei"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which desert, the second-largest shifting sand desert in the world, lies in the Xinjiang region?",
    answers: ["Gobi Desert", "Taklamakan Desert", "Ordos Desert", "Tengger Desert"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which major river, known as the 'Cradle of Chinese Civilization', is the second-longest in China?",
    answers: ["Yangtze River", "Yellow River (Huang He)", "Mekong River", "Amur River"], correctIndex: 1
  },

  // --- Japan ---
  {
    country: "JAPAN", difficulty: "EASY", text: "What is the capital city of Japan?",
    answers: ["Kyoto", "Tokyo", "Osaka", "Yokohama"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "Which of the four main islands of Japan is the largest and most populous?",
    answers: ["Hokkaido", "Honshu", "Kyushu", "Shikoku"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What is the highest mountain peak in Japan, located near Tokyo?",
    answers: ["Mount Kita", "Mount Fuji", "Mount Aso", "Mount Tate"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "Which Japanese city is famous for its historic temples, shrines, and former status as the imperial capital?",
    answers: ["Osaka", "Kyoto", "Sapporo", "Nara"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What is the northernmost of Japan's four main islands, famous for its cold winters and ski resorts?",
    answers: ["Honshu", "Hokkaido", "Kyushu", "Shikoku"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What scenic bay in Hiroshima is famous for the floating Itsukushima Shrine torii gate?",
    answers: ["Miyajima", "Matsushima", "Amanohashidate", "Sagami Bay"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Which body of water separates the Japanese archipelago from the Asian mainland?",
    answers: ["Pacific Ocean", "Sea of Japan (East Sea)", "East China Sea", "Okhotsk Sea"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which active volcano in Kyushu has one of the largest calderas in the world?",
    answers: ["Mount Sakurajima", "Mount Aso", "Mount Unzen", "Mount Kirishima"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which island group forms the southernmost prefecture of Japan, historically the Ryukyu Kingdom?",
    answers: ["Ogasawara Islands", "Okinawa Islands", "Izu Islands", "Tsushima"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "What is the largest freshwater lake in Japan, located in Shiga Prefecture?",
    answers: ["Lake Towada", "Lake Biwa", "Lake Suwa", "Lake Kasumigaura"], correctIndex: 1
  },

  // --- South Korea ---
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the capital city of South Korea?",
    answers: ["Busan", "Seoul", "Incheon", "Daegu"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the largest island in South Korea, famous for its volcanic landscape and tourism?",
    answers: ["Dokdo", "Jeju Island", "Ulleungdo", "Ganghwado"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "Which river flows directly through the center of Seoul?",
    answers: ["Nakdong River", "Han River", "Geum River", "Yeongsan River"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the second-largest city in South Korea, known as the primary port city?",
    answers: ["Incheon", "Busan", "Gwangju", "Daejeon"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What mountain range forms the spine of the Korean Peninsula along the east coast?",
    answers: ["Taebaek Mountains", "Sobaek Mountains", "Jirisan Range", "Hallasan Range"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What is the highest mountain peak in South Korea, located on Jeju Island?",
    answers: ["Mount Seorak", "Mount Halla (Hallasan)", "Mount Jiri", "Mount Bukhansan"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What is the name of the demilitarized buffer zone that splits North and South Korea?",
    answers: ["JSA", "DMZ", "NLL", "Panmunjom"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which national park on the mainland is famous for its dramatic rocky peaks and autumn foliage?",
    answers: ["Jirisan National Park", "Seoraksan National Park", "Bukhansan National Park", "Gyeongju National Park"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "What is the longest river in South Korea, flowing through Gyeongsang province to Busan?",
    answers: ["Han River", "Nakdong River", "Geum River", "Somjin River"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which volcanic island and its surrounding islets, disputed with Japan, lie in the Sea of Japan?",
    answers: ["Ulleungdo", "Dokdo (Liancourt Rocks)", "Jeju", "Jindo"], correctIndex: 1
  },

  // ==========================================
  // MYTHOLOGY
  // ==========================================
  // --- Philippines ---
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What is the name of the shape-shifting, flesh-eating monster in Philippine folklore, often depicted splitting its body?",
    answers: ["Tikbalang", "Manananggal", "Kapre", "Nuno sa Tabi"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What tall, hairy creature in Philippine folklore resides in large trees and smokes a cigar?",
    answers: ["Tiyanak", "Kapre", "Engkanto", "Aswang"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What half-man, half-horse creature in Philippine folklore is said to lead travelers astray in forests?",
    answers: ["Kapre", "Tikbalang", "Sigbin", "Tiyanak"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What demonic baby creature in Philippine mythology lures victims with its cries before attacking?",
    answers: ["Nuno", "Tiyanak", "Sigbin", "Duwende"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Who is the supreme deity and creator god in ancient Tagalog mythology?",
    answers: ["Mayari", "Bathala", "Tala", "Apo Laki"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Who is the goddess of the moon in Tagalog mythology, daughter of Bathala?",
    answers: ["Tala", "Mayari", "Hanang", "Idianale"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "What giant serpent in Visayan mythology is believed to swallow the moon, causing eclipses?",
    answers: ["Minokawa", "Bakunawa", "Galura", "Lalohon"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "In Ifugao mythology, who is the god of agriculture, often associated with the rice harvest?",
    answers: ["Liddum", "Kabunian", "Lumawig", "Bulul"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "What is the name of the Visayan god of death and ruler of the underworld (Kasanaan)?",
    answers: ["Sitan", "Sidapa", "Kan-Laon", "Yabag"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Which ancient Tagalog deity is the goddess of lost things, defense, and patron of homes?",
    answers: ["Lakan Danum", "Anitun Tabu", "Lakapati", "Diyan Masalanta"], correctIndex: 2
  },

  // --- United States ---
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What giant lumberjack in American folklore is accompanied by Babe the Blue Ox?",
    answers: ["Pecos Bill", "Paul Bunyan", "John Henry", "Johnny Appleseed"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What legendary cryptid, described as a humanoid goat-like creature, is rumored to live in Maryland?",
    answers: ["Mothman", "Goatman", "Jersey Devil", "Bigfoot"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What massive, ape-like cryptid is rumored to inhabit the forests of the Pacific Northwest?",
    answers: ["Jackalope", "Bigfoot (Sasquatch)", "Chupacabra", "Wendigo"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which Native American mythological bird is said to create thunder by flapping its wings?",
    answers: ["Phoenix", "Thunderbird", "Raven", "Coyote"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "In Native American Algonquian folklore, what malevolent cannibalistic spirit possesses humans in winter?",
    answers: ["Skinwalker", "Wendigo", "Chupacabra", "Jersey Devil"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "In Navajo folklore, what type of harmful witch has the ability to shape-shift into animals?",
    answers: ["Wendigo", "Skinwalker", "Kachina", "Kokopelli"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "What horned, winged cryptid is said to haunt the Pine Barrens of southern New Jersey?",
    answers: ["Mothman", "Jersey Devil", "Flatwoods Monster", "Chupacabra"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "What legendary U.S. steel driver raced against a steam-powered hammer, dying with his hammer in his hand?",
    answers: ["Casey Jones", "John Henry", "Paul Bunyan", "Pecos Bill"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "What Hopi mythological figure is depicted as a humpbacked flute player, representing fertility and music?",
    answers: ["Kachina", "Kokopelli", "Spider Woman", "Masauwu"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which creature of lumberjack folklore is described as a rabbit with antelope horns, native to Wyoming?",
    answers: ["Hodag", "Jackalope", "Splintercat", "Wampus Cat"], correctIndex: 1
  },

  // --- Great Britain ---
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Who is the legendary British king who ruled from Camelot and held the Round Table?",
    answers: ["King Alfred", "King Arthur", "King Richard", "King Lear"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What is the name of King Arthur's legendary magical sword?",
    answers: ["Excalibur", "Clarent", "Caledfwlch", "Durandal"], correctIndex: 0
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What famous wizard acts as King Arthur's advisor and mentor?",
    answers: ["Gandalf", "Merlin", "Dumbledore", "Morgana"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What legendary outlaw in English folklore stole from the rich to give to the poor in Sherwood Forest?",
    answers: ["William Tell", "Robin Hood", "Guy Fawkes", "Rob Roy"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Which mythical monster did the hero Beowulf defeat in the famous Old English epic poem?",
    answers: ["The Dragon", "Grendel", "The Kraken", "Minotaur"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "In Celtic folklore, what malevolent water spirit is said to inhabit Scottish lochs, often appearing as a horse?",
    answers: ["Banshee", "Kelpie", "Selkie", "Leprechaun"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "What mythical island is the resting place of King Arthur, where Excalibur was forged?",
    answers: ["Camelot", "Avalon", "Lyonesse", "Atlantis"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "In Welsh mythology, what famous sorceress is the mother of the legendary bard Taliesin?",
    answers: ["Rhiannon", "Ceridwen", "Branwen", "Arianrhod"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "What is the name of the legendary giant killed by Brutus of Troy, the mythical founder of London?",
    answers: ["Gogmagog", "Goliath", "Cormoran", "Ymir"], correctIndex: 0
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "In Celtic folklore, what marine creature is half-seal and half-human, shedding its skin to walk on land?",
    answers: ["Kelpie", "Selkie", "Mermaid", "Pixie"], correctIndex: 1
  },

  // --- China ---
  {
    country: "CHINA", difficulty: "EASY", text: "What mythical creature, symbol of the Emperor, represents power, strength, and good luck in Chinese culture?",
    answers: ["Phoenix", "Dragon (Long)", "Qilin", "Tiger"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "Who is the legendary Monkey King from the Chinese classic novel 'Journey to the West'?",
    answers: ["Zhu Bajie", "Sun Wukong", "Sha Wujing", "Erlang Shen"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "Who is the Chinese goddess of the Moon, who lives in the Moon palace with the Jade Rabbit?",
    answers: ["Nuwa", "Chang'e", "Mazu", "Xi Wangmu"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "Which ancient giant in Chinese creation myths separated heaven and earth with an axe?",
    answers: ["Fuxi", "Pangu", "Shennong", "Yu the Great"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which Chinese goddess is credited with creating humanity from yellow clay and repairing the pillars of heaven?",
    answers: ["Xi Wangmu", "Nuwa", "Mazu", "Chang'e"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "What mythical hooved chimerical beast in Chinese mythology represents prosperity and peace, appearing only during the reign of a wise ruler?",
    answers: ["Pixiu", "Qilin", "Fenghuang", "Nian"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Who is the supreme ruler of Heaven in Chinese folk religion and Taoist mythology?",
    answers: ["Yandi", "The Jade Emperor", "Yellow Emperor", "Fuxi"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which mythological ruler, one of the Three Sovereigns, is credited with teaching agriculture and herbal medicine?",
    answers: ["Fuxi", "Shennong", "Suiiren", "Cangjie"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "What is the name of the mythological goddess of the seas and patron of sailors in southern China and Taiwan?",
    answers: ["Nuwa", "Mazu", "Guan Yin", "Xi Wangmu"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "According to legend, which mythological ruler tamed the Great Flood of China by building a system of canals, founding the Xia Dynasty?",
    answers: ["Yao", "Shun", "Yu the Great", "Yellow Emperor"], correctIndex: 2
  },

  // --- Japan ---
  {
    country: "JAPAN", difficulty: "EASY", text: "Who is the sun goddess and central deity of the Shinto religion in Japanese mythology?",
    answers: ["Tsukuyomi", "Amaterasu", "Susanoo", "Izanami"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What is the general term for spirits, gods, or phenomena worshipped in Shinto mythology?",
    answers: ["Yokai", "Kami", "Oni", "Yurei"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What Japanese mythical creature is a water sprite with a water-filled dish on its head and a love for cucumbers?",
    answers: ["Tengu", "Kappa", "Tanuki", "Kitsune"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What shape-shifting fox creature in Japanese folklore is associated with the god Inari and possesses magical powers?",
    answers: ["Tanuki", "Kitsune", "Bakeneko", "Kappa"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Who is the Shinto god of sea and storms, brother of Amaterasu, who defeated the eight-headed serpent Yamata no Orochi?",
    answers: ["Tsukuyomi", "Susanoo", "Izanagi", "Kagutsuchi"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What are the red or blue demonic ogres commonly depicted in Japanese folklore carrying iron clubs?",
    answers: ["Tengu", "Oni", "Yokai", "Kappa"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Who was the primordial creator god in Shinto mythology who, along with Izanami, formed the islands of Japan?",
    answers: ["Susanoo", "Izanagi", "Tsukuyomi", "Ninigi"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which Japanese mythological figure is the grandchild of Amaterasu, sent to Earth to establish the imperial lineage?",
    answers: ["Izanagi", "Ninigi-no-Mikoto", "Jimmu", "Yamato Takeru"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "What is the name of the legendary eight-headed and eight-tailed Japanese dragon slain by Susanoo?",
    answers: ["Ryujin", "Yamata no Orochi", "Kiyotohime", "Toyotama-hime"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "What bird-like mountain spirits in Japanese folklore are skilled in martial arts, often carrying feather fans?",
    answers: ["Kappa", "Tengu", "Tanuki", "Oni"], correctIndex: 1
  },

  // --- South Korea ---
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "Who is the legendary founder of Gojoseon, the first Korean kingdom, born from a bear who became a woman?",
    answers: ["Hwanung", "Dangun", "Chumong", "Taejo"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the name of the mythical nine-tailed fox in Korean folklore that can transform into a beautiful woman?",
    answers: ["Kitsune", "Gumiho", "Huli Jing", "Imugi"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What trickster creature in Korean folklore, similar to a goblin, uses a magical club to summon items?",
    answers: ["Haetae", "Dokkaebi", "Gumiho", "Gwisin"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What legendary stone lion-like creature in Korean mythology protects Seoul from fire and disasters?",
    answers: ["Samjok-o", "Haetae (Haechi)", "Imugi", "Dokkaebi"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "In Korean creation myth, who is the Lord of Heaven whose son descended to Earth and fathered Dangun?",
    answers: ["Hwanin", "Hwanung", "Sanshin", "Yumla"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What giant serpent-like creature in Korean folklore must catch a Yeouiju (magical orb) to become a true dragon?",
    answers: ["Gumiho", "Imugi", "Haetae", "Bulgasari"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What three-legged crow in Korean mythology represents the sun and imperial power, highly prominent in Goguryeo art?",
    answers: ["Bonghwang", "Samjok-o", "Haetae", "Bulgasari"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Who is the Korean goddess of childbirth and fate, often depicted as three grandmothers in folk religion?",
    answers: ["Samsin Halmoni", "Bari Gongju", "Mago", "Jacheongbi"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "In Korean shamanic mythology, which abandoned princess travels to the underworld to find the water of life, becoming the patron of shamans?",
    answers: ["Princess Bari (Bari Gongju)", "Princess Nakrang", "Queen Seondeok", "Lady Suro"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "What legendary metal-eating monster in late Goryeo folklore was created from a rice doll and protects against evil?",
    answers: ["Dokkaebi", "Bulgasari", "Imugi", "Haetae"], correctIndex: 1
  },

  // ==========================================
  // ART
  // ==========================================
  // --- Philippines ---
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Which Filipino painter created the famous masterpiece 'Spoliarium', which won a gold medal at the Madrid Exposition in 1884?",
    answers: ["Felix Hidalgo", "Juan Luna", "Fernando Amorsolo", "Damian Domingo"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Who was the first National Artist of the Philippines, famous for his romanticized paintings of rural Philippine landscapes and sun-drenched maidens?",
    answers: ["Juan Luna", "Fernando Amorsolo", "Vicente Manansala", "Carlos Francisco"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Which National Artist for Visual Arts is famous for his historical murals, including those at the Manila City Hall?",
    answers: ["Guillermo Tolentino", "Carlos 'Botong' Francisco", "Napoleon Abueva", "BenCab"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Which Filipino sculptor is known as the 'Father of Modern Philippine Sculpture', famous for utilizing diverse materials?",
    answers: ["Napoleon Abueva", "Guillermo Tolentino", "Eduardo Castrillo", "Arturo Luz"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Which National Artist created the iconic 'Oblation' statue at the University of the Philippines?",
    answers: ["Napoleon Abueva", "Guillermo Tolentino", "Abdulmari Imao", "Solomon Saprid"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Which National Artist developed the 'Sabel' series, reflecting a female scavenger muse in Filipino society?",
    answers: ["Ang Kiukok", "Benedicto 'BenCab' Cabrera", "Hernando Ocampo", "Cesar Legaspi"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Which National Artist for Sculpture integrated Islamic Tausug motifs like the Sarimanok into modern sculpture?",
    answers: ["Guillermo Tolentino", "Abdulmari Imao", "Napoleon Abueva", "Francisco Coching"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Which Filipino painter is renowned for his highly expressionist, often disturbing paintings of crucified figures, beggars, and stray dogs?",
    answers: ["Cesar Legaspi", "Ang Kiukok", "Hernando Ocampo", "Vicente Manansala"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Who was the leading Filipino modernist painter who painted the abstract, colorful masterpiece 'Genesis'?",
    answers: ["Vicente Manansala", "Hernando R. Ocampo", "Arturo Luz", "Jose Joya"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Which National Artist pioneered 'Transparent Cubism', visible in works like 'Madonna of the Slums'?",
    answers: ["Hernando Ocampo", "Vicente Manansala", "Cesar Legaspi", "Ang Kiukok"], correctIndex: 1
  },

  // --- United States ---
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which American pop artist is famous for his screenprints of Campbell's Soup Cans and Marilyn Monroe?",
    answers: ["Jackson Pollock", "Andy Warhol", "Roy Lichtenstein", "Keith Haring"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which American painter is famous for the regionalist masterpiece 'American Gothic' depicting a farmer and his daughter?",
    answers: ["Edward Hopper", "Grant Wood", "Andrew Wyeth", "Georgia O'Keeffe"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which American artist pioneered action painting by dripping paint onto canvas, earning the nickname 'Jack the Dripper'?",
    answers: ["Willem de Kooning", "Jackson Pollock", "Mark Rothko", "Jean-Michel Basquiat"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which American painter is known as the 'Mother of American Modernism', famous for her close-up paintings of flowers?",
    answers: ["Mary Cassatt", "Georgia O'Keeffe", "Helen Frankenthaler", "Lee Krasner"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which U.S. artist painted the famous 1942 work 'Nighthawks', depicting customers sitting in a downtown diner at night?",
    answers: ["Grant Wood", "Edward Hopper", "Andrew Wyeth", "Jackson Pollock"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which 19th-century American impressionist painter is famous for her portraits of mothers and children?",
    answers: ["Georgia O'Keeffe", "Mary Cassatt", "Lee Krasner", "Elaine de Kooning"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which Brooklyn-born neo-expressionist artist rose to fame in the 1980s with raw, graffiti-inspired paintings?",
    answers: ["Keith Haring", "Jean-Michel Basquiat", "Andy Warhol", "Jeff Koons"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which U.S. landscape painter founded the Hudson River School art movement in the 1830s?",
    answers: ["Albert Bierstadt", "Thomas Cole", "Frederic Edwin Church", "Asher Brown Durand"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which U.S. sculptor created the massive, kinetic wire mobile sculptures suspended in major museums?",
    answers: ["Alexander Calder", "Isamu Noguchi", "Claes Oldenburg", "Donald Judd"], correctIndex: 0
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which American abstract expressionist painter is famous for his large color field paintings featuring soft-edged blocks of color?",
    answers: ["Jackson Pollock", "Mark Rothko", "Barnett Newman", "Clyfford Still"], correctIndex: 1
  },

  // --- Great Britain ---
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What is the pseudonym of the Bristol-born anonymous graffiti artist famous for stenciled political street art?",
    answers: ["Dali", "Banksy", "Damien Hirst", "Tracey Emin"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which 19th-century British romantic painter is famous for dramatic marine landscapes like 'The Fighting Temeraire'?",
    answers: ["John Constable", "J.M.W. Turner", "William Blake", "Thomas Gainsborough"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which English sculptor is famous for his large, semi-abstract bronze sculptures of reclining figures?",
    answers: ["Barbara Hepworth", "Henry Moore", "Antony Gormley", "Anish Kapoor"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What legendary English poet, painter, and printmaker created the iconic print 'The Ancient of Days'?",
    answers: ["J.M.W. Turner", "William Blake", "John Constable", "Dante Gabriel Rossetti"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Which English landscape painter of the Romantic period is famous for painting rural scenes like 'The Hay Wain'?",
    answers: ["J.M.W. Turner", "John Constable", "Thomas Gainsborough", "Joshua Reynolds"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Which contemporary British artist is famous for preserving dead animals (like a shark) in formaldehyde?",
    answers: ["Tracey Emin", "Damien Hirst", "Antony Gormley", "David Hockney"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Which British sculptor designed the massive 'Angel of the North' steel sculpture in Gateshead?",
    answers: ["Henry Moore", "Antony Gormley", "Anish Kapoor", "Richard Serra"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which Irish-born British figurative painter of the 20th century is famous for raw, screaming pope portraits?",
    answers: ["Lucian Freud", "Francis Bacon", "David Hockney", "Peter Blake"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which 19th-century English designer, writer, and artist was a key figure in the Arts and Crafts Movement?",
    answers: ["John Ruskin", "William Morris", "Dante Gabriel Rossetti", "Aubrey Beardsley"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which British artist painted the iconic pop art collage 'Just what is it that makes today's homes so different, so appealing?' in 1956?",
    answers: ["Peter Blake", "Richard Hamilton", "David Hockney", "Eduardo Paolozzi"], correctIndex: 1
  },

  // --- China ---
  {
    country: "CHINA", difficulty: "EASY", text: "What traditional style of Chinese visual art utilizes ink brushes on paper or silk scrolls?",
    answers: ["Watercolor", "Shanshui (Ink Wash Painting)", "Oil Painting", "Tempera"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What ancient Chinese art form involves the decorative writing of Chinese characters using a brush?",
    answers: ["Engraving", "Calligraphy", "Origami", "Lithography"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What type of ceramic material, invented in China, is famous for its blue and white designs?",
    answers: ["Terracotta", "Porcelain", "Stoneware", "Earthenware"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "Which modern Chinese artist and activist is famous for designing the Beijing Olympic Stadium ('Bird's Nest')?",
    answers: ["Zhang Xiaogang", "Ai Weiwei", "Yue Minjun", "Zao Wou-Ki"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "What is the literal translation of 'Shanshui', the traditional style of Chinese landscape painting?",
    answers: ["Flower and Bird", "Mountain and Water", "Wind and Fire", "Heaven and Earth"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which Tang Dynasty painter and poet is traditionally regarded as the founder of monochrome ink wash painting?",
    answers: ["Li Zhaodao", "Wang Wei", "Wu Daozi", "Gu Kaizhi"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which modern Chinese painter is famous for his highly expressive, calligraphic paintings of galloping horses?",
    answers: ["Qi Baishi", "Xu Beihong", "Zhang Daqian", "Wu Guanzhong"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which 20th-century Chinese master is famous for his whimsical ink paintings of shrimp, crabs, and frogs?",
    answers: ["Xu Beihong", "Qi Baishi", "Zhang Daqian", "Fu Baoshi"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which Chinese artist of the Northern Song Dynasty painted the monumental landscape scroll 'Travelers Among Mountains and Streams'?",
    answers: ["Guo Xi", "Fan Kuan", "Ma Yuan", "Xia Gui"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which contemporary Chinese painter is famous for his 'Bloodline: Big Family' series of monochromatic stylized portraits?",
    answers: ["Yue Minjun", "Zhang Xiaogang", "Fang Lijun", "Zeng Fanzhi"], correctIndex: 1
  },

  // --- Japan ---
  {
    country: "JAPAN", difficulty: "EASY", text: "What style of Japanese woodblock prints and paintings, meaning 'pictures of the floating world', was popular in the Edo period?",
    answers: ["Manga", "Ukiyo-e", "Nihonga", "Sumie"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "Which Japanese artist painted the iconic woodblock print 'The Great Wave off Kanagawa'?",
    answers: ["Utamaro", "Katsushika Hokusai", "Hiroshige", "Yoshitoshi"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What is the traditional Japanese art of paper folding, creating shapes without cutting?",
    answers: ["Ikebana", "Origami", "Bonsai", "Kintsugi"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What Japanese art form involves repairing broken pottery with lacquer dusted with powdered gold or silver?",
    answers: ["Kintsugi", "Ikebana", "Bonsai", "Kirigami"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Which Japanese ukiyo-e artist is famous for 'Fifty-three Stations of the Tokaido' landscape series?",
    answers: ["Hokusai", "Utagawa Hiroshige", "Kitagawa Utamaro", "Sharaku"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What contemporary Japanese artist is world-famous for her extensive use of polka dots and infinity room installations?",
    answers: ["Takashi Murakami", "Yayoi Kusama", "Yoshitomo Nara", "Mariko Mori"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "Which Japanese contemporary artist founded the 'Superflat' art movement, blending anime pop culture and traditional art?",
    answers: ["Yoshitomo Nara", "Takashi Murakami", "Yayoi Kusama", "Hiroshi Sugimoto"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which Japanese painter of the Azuchi-Momoyama period painted the famous 'Pine Trees' ink wash folding screen?",
    answers: ["Kano Eitoku", "Hasegawa Tohaku", "Tawaraya Sotatsu", "Ogata Korin"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which Japanese Zen Buddhist monk of the Muromachi period is famous for his monochrome ink landscape 'Catching a Catfish with a Gourd'?",
    answers: ["Sesson", "Josetsu", "Tensho Shubun", "Sesshu Toyo"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which Japanese painter is celebrated as the greatest master of ink wash painting, creating 'Splashed-ink Landscape' in 1495?",
    answers: ["Josetsu", "Sesshu Toyo", "Hasegawa Tohaku", "Kano Masanobu"], correctIndex: 1
  },

  // --- South Korea ---
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the name of the traditional Korean attire, often painted in historical folk art?",
    answers: ["Kimono", "Hanbok", "Cheongsam", "Ao Dai"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What type of Korean celadon pottery of the Goryeo Dynasty is famous for its pale jade-green glaze?",
    answers: ["Baekja (White Porcelain)", "Goryeo Celadon", "Buncheong", "Onggi"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is the name of traditional Korean paper made from mulberry bark, used in painting and crafts?",
    answers: ["Washi", "Hanji", "Xuan Paper", "Papyrus"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "Which contemporary South Korean artist is famous for his giant, fabric-themed architectural installations?",
    answers: ["Lee Ufan", "Do Ho Suh", "Nam June Paik", "Kimsooja"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "Which Korean-American artist is widely considered the 'Father of Video Art', famous for using TV monitors in sculptures?",
    answers: ["Do Ho Suh", "Nam June Paik", "Lee Ufan", "Park Seo-bo"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What Korean art movement of the 1970s focused on monochrome, highly textured abstract paintings?",
    answers: ["Minjung Art", "Dansaekhwa", "Superflat", "Sanshindo"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "Which Joseon Dynasty genre painter is famous for his satirical and realistic paintings of commoners, such as 'Ssireum' (Wrestling)?",
    answers: ["Shin Yun-bok", "Kim Hong-do", "Jeong Seon", "An Gyeon"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which Joseon painter pioneered 'true-view landscape painting' (jingyeong sansuhwa), painting local landscapes like Mount Geumgang?",
    answers: ["Kim Hong-do", "Jeong Seon", "Shin Yun-bok", "An Gyeon"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which minimalist artist and sculptor is a co-founder of Mono-ha, working primarily with steel plates and stones?",
    answers: ["Park Seo-bo", "Lee Ufan", "Nam June Paik", "Suh Do-suh"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which Joseon Dynasty female artist and poet is famous for her paintings of plants, insects, and fruits, featured on the 50,000 won banknote?",
    answers: ["Hwang Jini", "Shin Saimdang", "Heo Nanseolheon", "Queen Seondeok"], correctIndex: 1
  },

  // ==========================================
  // ANIMALS
  // ==========================================
  // --- Philippines ---
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What is the national animal of the Philippines, heavily used in agriculture?",
    answers: ["Tarsier", "Carabao", "Tamaraw", "Philippine Eagle"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "What is the national bird of the Philippines, also known as the monkey-eating eagle?",
    answers: ["Rufous Hornbill", "Philippine Eagle", "Brahminy Kite", "Philippine Cockatoo"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Which tiny primate, famous for its giant eyes, is native to the island of Bohol?",
    answers: ["Slow Loris", "Philippine Tarsier", "Macaque", "Gibbon"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "EASY", text: "Which dwarf forest buffalo is endemic to the island of Mindoro and is critically endangered?",
    answers: ["Carabao", "Tamaraw", "Anoa", "Banteng"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Which small, nocturnal, endangered mammal found in Palawan is covered in hard keratin scales?",
    answers: ["Palawan Bearcat", "Philippine Pangolin", "Civet Cat", "Tarsier"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "What is the local name of the whale shark, which gathers in large numbers in Donsol, Sorsogon?",
    answers: ["Tuki", "Butanding", "Pating", "Pugita"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "MEDIUM", text: "Which endangered, nocturnal mammal endemic to Palawan has a prehensile tail and is related to the binturong?",
    answers: ["Palawan Pangolin", "Palawan Bearcat", "Palawan Leopard Cat", "Clouded Leopard"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Which critically endangered crocodile species, smaller than the saltwater crocodile, is endemic to the Philippines?",
    answers: ["Mindoro Crocodile", "Philippine Crocodile (Crocodylus mindorensis)", "Estuarine Crocodile", "Siam Crocodile"], correctIndex: 1
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "Which flightless rail bird, endemic to a single island in northern Luzon, was discovered in 2004?",
    answers: ["Calayan Rail", "Philippine Hanging Parrot", "Luzon Bleeding-heart", "Mindanao Lorikeet"], correctIndex: 0
  },
  {
    country: "PHILIPPINES", difficulty: "HARD", text: "What is the name of the rare, venomous pit viper species endemic to the islands of Panay, Negros, and Masbate?",
    answers: ["Philippine Cobra", "McGregor's Pit Viper", "Samar Cobra", "Green Pit Viper"], correctIndex: 1
  },

  // --- United States ---
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What is the national bird and symbol of the United States?",
    answers: ["Golden Eagle", "Bald Eagle", "Peregrine Falcon", "Red-tailed Hawk"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "What massive land mammal, designated the U.S. national mammal in 2016, once roamed the Great Plains in millions?",
    answers: ["Grizzly Bear", "American Bison", "Moose", "Elk"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which large, nocturnal rodent, famous for building dams, is found across North America?",
    answers: ["Muskrat", "American Beaver", "Porcupine", "Groundhog"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "EASY", text: "Which state is famous for the Florida Manatee, a large aquatic mammal living in warm coastal waters?",
    answers: ["California", "Florida", "Texas", "Louisiana"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which endangered canid is the most red-colored wolf species, native to the southeastern United States?",
    answers: ["Gray Wolf", "Red Wolf", "Coyote", "Dhole"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "Which highly toxic newt species, native to the Pacific Northwest, produces tetrodotoxin?",
    answers: ["California Newt", "Rough-skinned Newt", "Eastern Newt", "Red-spotted Newt"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "MEDIUM", text: "What large, wild feline species, also known as the cougar or panther, is native to North America?",
    answers: ["Bobcat", "Mountain Lion", "Lynx", "Ocelot"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which critically endangered North American bird, famous for its height and loud call, was saved by captive breeding programs?",
    answers: ["California Condor", "Whooping Crane", "Trumpeter Swan", "Ivory-billed Woodpecker"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which small, black-footed carnivore is the only ferret species native to North America?",
    answers: ["Least Weasel", "Black-footed Ferret", "Fisher", "American Marten"], correctIndex: 1
  },
  {
    country: "UNITED_STATES", difficulty: "HARD", text: "Which venomous lizard species, famous for its black and orange beaded pattern, is native to the southwestern US?",
    answers: ["Beaded Lizard", "Gila Monster", "Chuckwalla", "Horned Lizard"], correctIndex: 1
  },

  // --- Great Britain ---
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What small, red-breasted bird is Britain's national bird and a symbol of Christmas?",
    answers: ["House Sparrow", "European Robin", "Blue Tit", "Blackbird"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What prickly mammal is native to the British countryside, famous for rolling into a ball?",
    answers: ["Badger", "European Hedgehog", "Otter", "Red Squirrel"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "Which red-furred native rodent species has faced severe decline due to the introduction of the gray squirrel?",
    answers: ["Gray Squirrel", "Red Squirrel", "Dormouse", "Field Vole"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "EASY", text: "What omnivorous, burrowing mammal with black and white stripes on its face is common in British woodlands?",
    answers: ["Fox", "European Badger", "Pine Marten", "Stoat"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "Which marine mammal species has its largest European breeding colonies in Britain, notably in Norfolk?",
    answers: ["Common Dolphin", "Grey Seal", "Harbour Porpoise", "Killer Whale"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "What is the only venomous snake native to Great Britain?",
    answers: ["Grass Snake", "Adder (Vipera berus)", "Smooth Snake", "Slow Worm"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "MEDIUM", text: "What species of large deer, native to Britain, is the country's largest wild land mammal?",
    answers: ["Roe Deer", "Red Deer", "Fallow Deer", "Muntjac"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which elusive carnivorous mammal of the weasel family is slowly repopulating Scotland and Wales?",
    answers: ["Polecat", "Pine Marten", "Stoat", "Wildcat"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "What is the name of the rare, critically endangered feline species native only to the Scottish Highlands?",
    answers: ["Lynx", "Scottish Wildcat (Felis silvestris)", "European Wildcat", "Ocelot"], correctIndex: 1
  },
  {
    country: "GREAT_BRITAIN", difficulty: "HARD", text: "Which British bird of prey, which nests on cliffs, was successfully reintroduced after going extinct in England in 1979?",
    answers: ["Golden Eagle", "Peregrine Falcon", "Red Kite", "Osprey"], correctIndex: 2
  },

  // --- China ---
  {
    country: "CHINA", difficulty: "EASY", text: "Which black and white bear, native to south-central China, is a global symbol of conservation?",
    answers: ["Red Panda", "Giant Panda", "Asian Black Bear", "Sun Bear"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What small, reddish-brown mammal with a ringed tail is native to the Himalayas and southwestern China?",
    answers: ["Raccoon", "Red Panda", "Giant Panda", "Civet Cat"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What critically endangered reptile, native to the Yangtze River, is the only alligator species outside North America?",
    answers: ["Chinese Giant Salamander", "Chinese Alligator", "Gharial", "Komodo Dragon"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "EASY", text: "What is the name of the rare, long-haired big cat species native to the mountain ranges of Central Asia and western China?",
    answers: ["Amur Leopard", "Snow Leopard", "Clouded Leopard", "Siberian Tiger"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which large, critically endangered amphibian, the largest salamander in the world, is native to Chinese mountain streams?",
    answers: ["Axolotl", "Chinese Giant Salamander", "Hellbender", "Tiger Salamander"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "Which endangered monkey species, native to southwestern China, has a blue face and a distinct upturned nose?",
    answers: ["Macaque", "Golden Snub-nosed Monkey", "Gibbon", "Langur"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "MEDIUM", text: "What rare dolphin species, endemic to the Yangtze River, was declared functionally extinct in 2006?",
    answers: ["Finless Porpoise", "Baiji (Yangtze River Dolphin)", "Irrawaddy Dolphin", "Pink Dolphin"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which endangered deer species, native to China, has a horse-like head, donkey-like tail, and cow-like hooves?",
    answers: ["Sika Deer", "Milu (Elaphurus davidianus)", "Musk Deer", "Water Deer"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "What is the name of the rare pheasant species native to central China, famous for its golden crest and bright red body?",
    answers: ["Lady Amherst's Pheasant", "Golden Pheasant", "Silver Pheasant", "Reeves's Pheasant"], correctIndex: 1
  },
  {
    country: "CHINA", difficulty: "HARD", text: "Which subspecies of leopard, native to northern China and the Russian Far East, is one of the rarest big cats in the world?",
    answers: ["Snow Leopard", "Amur Leopard (Panthera pardus orientalis)", "Indochinese Leopard", "Clouded Leopard"], correctIndex: 1
  },

  // --- Japan ---
  {
    country: "JAPAN", difficulty: "EASY", text: "What species of monkey, also called the 'snow monkey', is famous for bathing in hot springs in Nagano?",
    answers: ["Japanese Macaque", "Gibbon", "Langur", "Capuchin"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What medium-sized, dog-like mammal native to Japan is also known as the raccoon dog?",
    answers: ["Shiba Inu", "Tanuki", "Kitsune", "Japanese Badger"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What famous Japanese dog breed is known for its loyalty, epitomized by Hachiko?",
    answers: ["Shiba Inu", "Akita Inu", "Tosa Ken", "Hokkaido Dog"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "EASY", text: "What small, popular Japanese dog breed is famous for its alert nature and fox-like face?",
    answers: ["Akita Inu", "Shiba Inu", "Kishu Ken", "Kai Ken"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What giant salamander species, endemic to Japan, is the second-largest salamander in the world?",
    answers: ["Chinese Giant Salamander", "Japanese Giant Salamander", "Rough-skinned Newt", "Hellbender"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What species of large crane is a symbol of luck, longevity, and fidelity in Japanese culture?",
    answers: ["Siberian Crane", "Red-crowned Crane", "Sandhill Crane", "Hooded Crane"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "MEDIUM", text: "What wild cat subspecies, critically endangered, is native only to the Japanese island of Iriomote?",
    answers: ["Tsushima Leopard Cat", "Iriomote Cat", "Ryukyu Wildcat", "Amami Rabbit Cat"], correctIndex: 1
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "What dark-furred, primitive rabbit species is endemic only to two small islands in the Amami archipelago?",
    answers: ["Amami Rabbit", "Japanese Hare", "Ryukyu Rabbit", "Pika"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "Which Japanese bird, a species of ibis with a pinkish-white body, was successfully bred back from extinction in Japan?",
    answers: ["Crested Ibis (Toki)", "Black-headed Ibis", "Scarlet Ibis", "Glossy Ibis"], correctIndex: 0
  },
  {
    country: "JAPAN", difficulty: "HARD", text: "What subspecies of the Asian black bear is native to the Japanese islands of Honshu and Shikoku?",
    answers: ["Hokkaido Brown Bear", "Japanese Black Bear", "Ussuri Brown Bear", "Sun Bear"], correctIndex: 1
  },

  // --- South Korea ---
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What subspecies of tiger, historically native to Korea, is South Korea's official national animal?",
    answers: ["Bengal Tiger", "Siberian Tiger (Amur Tiger)", "Sumatran Tiger", "Malayan Tiger"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "What is South Korea's national dog breed, native to Jindo Island and famous for its loyalty?",
    answers: ["Pungsan Dog", "Korean Jindo", "Sapsali", "Nureongi"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "Which small, striped rodent, native to Korea, is popular as a pet and common in forests?",
    answers: ["Siberian Chipmunk", "Red Squirrel", "Flying Squirrel", "Dormouse"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "EASY", text: "Which migratory bird, a symbol of good luck, builds mud nests under roofs in Korean villages?",
    answers: ["Magpie", "Barn Swallow", "Crane", "Crow"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "Which Korean dog breed, whose name means 'dogs that dispel evil spirits', has long, shaggy fur?",
    answers: ["Jindo", "Sapsali", "Pungsan", "Donggyeongi"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "What species of small, tusked deer, native to Korea, is famous for its lack of antlers and vampire-like look?",
    answers: ["Sika Deer", "Water Deer (Korae)", "Musk Deer", "Roe Deer"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "MEDIUM", text: "Which dog breed, native to North Korea's mountainous regions, was historically bred for hunting tigers?",
    answers: ["Jindo", "Pungsan Dog", "Sapsali", "Nureongi"], correctIndex: 1
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which species of small, fanged deer, native to the highlands of Korea, is highly endangered due to hunting for its scent glands?",
    answers: ["Siberian Musk Deer", "Water Deer", "Sika Deer", "Elk"], correctIndex: 0
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which critically endangered black bear subspecies is being reintroduced in Jirisan National Park?",
    answers: ["Ussuri Brown Bear", "Ussuri Dhole", "Asiatic Black Bear (Half-moon Bear)", "Sloth Bear"], correctIndex: 2
  },
  {
    country: "SOUTH_KOREA", difficulty: "HARD", text: "Which species of giant longhorn beetle, native to Korea, is protected as a National Natural Monument?",
    answers: ["Callipogon relictus (Relict Longhorn)", "Stag Beetle", "Atlas Beetle", "Jewel Beetle"], correctIndex: 0
  }
];

function computeBadge(totalPoints: number) {
  if (totalPoints >= 2500) return "SCHOLAR";
  if (totalPoints >= 1000) return "GOLD";
  if (totalPoints >= 500) return "SILVER";
  return "BRONZE";
}

async function main() {
  console.log("Starting database truncation...");
  await prisma.$transaction([
    prisma.score.deleteMany(),
    prisma.user.deleteMany(),
    prisma.answer.deleteMany(),
    prisma.question.deleteMany(),
    prisma.category.deleteMany(),
  ]);
  console.log("Truncation complete.");

  console.log("Seeding categories...");
  const seededCategories: Record<string, string> = {};

  for (const category of categories) {
    const record = await prisma.category.create({
      data: {
        name: category.name,
        icon: category.icon,
      },
    });
    seededCategories[category.name.toUpperCase()] = record.id;
  }
  console.log("Categories seeded successfully.");

  console.log(`Seeding ${questionBank.length} questions and answers...`);
  for (const q of questionBank) {
    const categoryId = seededCategories[q.country === "PHILIPPINES" || q.country !== "PHILIPPINES" ? q.text ? q.text : "" : ""] || seededCategories[Object.keys(seededCategories).find(k => q.text ? true : false) || ""] ;
    // Resolve the category ID correctly based on structural search in questionBank
  }

  // To be safe, let's map categories properly:
  // Science: index 0 to 59
  // History: index 60 to 119
  // Geography: index 120 to 179
  // Mythology: index 180 to 239
  // Art: index 240 to 299
  // Animals: index 300 to 359
  
  const categoryNames = ["Science", "History", "Geography", "Mythology", "Art", "Animals"];

  for (let i = 0; i < questionBank.length; i++) {
    const q = questionBank[i];
    const categoryIndex = Math.floor(i / 60);
    const catName = categoryNames[categoryIndex];
    const categoryId = seededCategories[catName.toUpperCase()];

    if (!categoryId) {
      console.error(`Category ID not found for ${catName}`);
      continue;
    }

    await prisma.question.create({
      data: {
        text: q.text,
        difficulty: q.difficulty,
        country: q.country,
        categoryId,
        answers: {
          create: q.answers.map((answerText, index) => ({
            text: answerText,
            isCorrect: index === q.correctIndex,
          })),
        },
      },
    });
  }
  console.log("Questions and answers seeded successfully.");

  console.log("Seeding users...");
  const seedUsersData = [
    { username: "ace", name: "Ace", age: 10, ageGroup: "KIDS" as const },
    { username: "nova", name: "Nova", age: 15, ageGroup: "TEEN" as const },
    { username: "pixel", name: "Pixel", age: 25, ageGroup: "ADULT" as const },
    { username: "astro", name: "Astro", age: 30, ageGroup: "ADULT" as const },
    { username: "quark", name: "Quark", age: 12, ageGroup: "KIDS" as const },
  ];

  const users = await Promise.all(
    seedUsersData.map((u) =>
      prisma.user.create({
        data: {
          username: u.username,
          name: u.name,
          age: u.age,
          ageGroup: u.ageGroup,
          totalPoints: 0,
          badge: "BRONZE",
        },
      })
    )
  );
  console.log("Users seeded successfully.");

  console.log("Seeding mock scores history...");
  const dbCategories = await prisma.category.findMany();
  for (const category of dbCategories) {
    for (const user of users) {
      const correctAnswers = 6 + Math.floor(Math.random() * 5); // 6-10 correct
      const totalQuestions = 10;
      const usedTimeMs = 60000 + Math.floor(Math.random() * 50000);
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
  console.log("Scores seeded successfully.");

  console.log("Computing user total points and badges...");
  for (const user of users) {
    const scores = await prisma.score.findMany({
      where: { userId: user.id },
      select: { points: true },
    });
    const totalPoints = scores.reduce((sum, s) => sum + s.points, 0);
    const badge = computeBadge(totalPoints);
    await prisma.user.update({
      where: { id: user.id },
      data: { totalPoints, badge },
    });
  }
  console.log("User points and badges updated successfully.");

  console.log("Database seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed execution failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
