// Mock Data based on the provided JSON structure

export const mockStates = [
  {
    id: "rajasthan",
    title: "Rajasthan",
    subtitle: "The Land of Kings",
    coverImage: "rajasthan.jpg",
    slideshowImages: ["rajasthan1.jpg", "rajasthan2.jpg"],
    about:
      "<p>Rajasthan is known for its royal heritage, magnificent palaces, and vibrant culture. The state offers a glimpse into India's regal past with its stunning architecture and rich traditions.</p>",
    cityIds: ["jaipur", "udaipur"],
    placeIds: [
      "hawa-mahal",
      "amber-fort",
      "city-palace-udaipur",
      "lake-pichola",
    ],
    foodIds: ["dal-baati", "ghewar", "malpua"],
  },
  {
    id: "kerala",
    title: "Kerala",
    subtitle: "God's Own Country",
    coverImage: "kerala.jpg",
    slideshowImages: ["kerala1.jpg", "kerala2.jpg"],
    about:
      "<p>Kerala is known for its lush greenery, backwaters, and tropical climate. It's a perfect destination for those seeking tranquility and natural beauty.</p>",
    cityIds: ["kochi", "munnar"],
    placeIds: ["fort-kochi", "marine-drive", "tea-gardens", "eravikulam-park"],
    foodIds: ["appam", "fish-curry", "puttu"],
  },
  {
    id: "goa",
    title: "Goa",
    subtitle: "Pearl of the Orient",
    coverImage: "goa.jpg",
    slideshowImages: ["goa1.jpg", "goa2.jpg"],
    about:
      "<p>Goa is famous for its beautiful beaches, Portuguese architecture, and vibrant nightlife. It's a perfect blend of Indian and European cultures.</p>",
    cityIds: ["panaji", "margao"],
    placeIds: ["basilica-of-bom-jesus", "aguada-fort"],
    foodIds: ["vindaloo", "bebinca"],
  },
];

export const mockCities = [
  {
    id: "jaipur",
    stateId: "rajasthan",
    title: "Jaipur",
    coverImage: "jaipur.jpg",
    slideshowImages: ["jaipur1.jpg", "jaipur2.jpg"],
    about:
      "<p>Jaipur is the capital of Rajasthan, known as the Pink City for its distinctive pink-colored buildings. It's famous for its palaces, forts, and vibrant markets.</p>",
    placeIds: ["hawa-mahal", "amber-fort"],
    foodIds: ["dal-baati", "ghewar"],
  },
  {
    id: "udaipur",
    stateId: "rajasthan",
    title: "Udaipur",
    coverImage: "udaipur.jpg",
    slideshowImages: ["udaipur1.jpg", "udaipur2.jpg"],
    about:
      "<p>Udaipur, the City of Lakes, is known for its romantic ambiance, beautiful palaces, and serene lakes. It's often called the Venice of the East.</p>",
    placeIds: ["city-palace-udaipur", "lake-pichola"],
    foodIds: ["dal-baati", "malpua"],
  },
  {
    id: "kochi",
    stateId: "kerala",
    title: "Kochi",
    coverImage: "kochi.jpg",
    slideshowImages: ["kochi1.jpg", "kochi2.jpg"],
    about:
      "<p>Kochi is a port city in Kerala, known for its historic significance, beautiful backwaters, and cultural diversity. It's a perfect blend of tradition and modernity.</p>",
    placeIds: ["fort-kochi", "marine-drive"],
    foodIds: ["appam", "fish-curry"],
  },
  {
    id: "munnar",
    stateId: "kerala",
    title: "Munnar",
    coverImage: "munnar.jpg",
    slideshowImages: ["munnar1.jpg", "munnar2.jpg"],
    about:
      "<p>Munnar is a hill station known for its tea plantations, misty mountains, and cool climate. It's a perfect destination for nature lovers.</p>",
    placeIds: ["tea-gardens", "eravikulam-park"],
    foodIds: ["puttu", "banana-chips"],
  },
];

export const mockPlaces = [
  {
    id: "hawa-mahal",
    title: "Hawa Mahal",
    coverImage: "hawa-mahal.jpg",
    slideshowImages: ["hawa-mahal1.jpg", "hawa-mahal2.jpg"],
    description:
      "A palace with unique architecture and ventilation, built in 1799. Also known as the Palace of Winds.",
    cityId: "jaipur",
    stateId: "rajasthan",
  },
  {
    id: "amber-fort",
    title: "Amber Fort",
    coverImage: "amber.jpg",
    slideshowImages: ["amber1.jpg", "amber2.jpg"],
    description:
      "A magnificent fort with scenic views, known for its artistic Hindu style elements and stunning mirror work.",
    cityId: "jaipur",
    stateId: "rajasthan",
  },
  {
    id: "city-palace-udaipur",
    title: "City Palace",
    coverImage: "city-palace.jpg",
    slideshowImages: ["city-palace1.jpg", "city-palace2.jpg"],
    description:
      "A beautiful palace complex situated on the banks of Lake Pichola, showcasing Rajasthani and Mughal architecture.",
    cityId: "udaipur",
    stateId: "rajasthan",
  },
  {
    id: "lake-pichola",
    title: "Lake Pichola",
    coverImage: "lake-pichola.jpg",
    slideshowImages: ["lake-pichola1.jpg", "lake-pichola2.jpg"],
    description:
      "An artificial freshwater lake created in 1362, offering boat rides and stunning sunset views.",
    cityId: "udaipur",
    stateId: "rajasthan",
  },
  {
    id: "fort-kochi",
    title: "Fort Kochi",
    coverImage: "fort-kochi.jpg",
    slideshowImages: ["fort-kochi1.jpg", "fort-kochi2.jpg"],
    description:
      "A historic area with Portuguese colonial architecture, Chinese fishing nets, and charming streets.",
    cityId: "kochi",
    stateId: "kerala",
  },
  {
    id: "marine-drive",
    title: "Marine Drive",
    coverImage: "marine-drive.jpg",
    slideshowImages: ["marine-drive1.jpg", "marine-drive2.jpg"],
    description:
      "A beautiful promenade along the backwaters of Kochi, perfect for evening walks and street food.",
    cityId: "kochi",
    stateId: "kerala",
  },
];

export const mockFoods = [
  {
    id: "dal-baati",
    title: "Dal Baati Churma",
    coverImage: "dal-baati.jpg",
    slideshowImages: ["dal-baati1.jpg", "dal-baati2.jpg"],
    description:
      "A staple Rajasthani dish made of lentils and baked wheat balls, served with churma (sweet mixture).",
    cityIds: ["jaipur", "udaipur"],
    stateIds: ["rajasthan"],
  },
  {
    id: "ghewar",
    title: "Ghewar",
    coverImage: "ghewar.jpg",
    slideshowImages: ["ghewar1.jpg", "ghewar2.jpg"],
    description:
      "A disc-shaped sweet soaked in sugar syrup, popular during festivals in Rajasthan.",
    cityIds: ["jaipur"],
    stateIds: ["rajasthan"],
  },
  {
    id: "appam",
    title: "Appam",
    coverImage: "appam.jpg",
    slideshowImages: ["appam1.jpg", "appam2.jpg"],
    description:
      "A type of pancake made with fermented rice batter and coconut milk, popular in Kerala cuisine.",
    cityIds: ["kochi"],
    stateIds: ["kerala"],
  },
  {
    id: "fish-curry",
    title: "Fish Curry",
    coverImage: "fish-curry.jpg",
    slideshowImages: ["fish-curry1.jpg", "fish-curry2.jpg"],
    description:
      "A spicy and tangy curry made with fresh fish and coconut milk, a staple in Kerala cuisine.",
    cityIds: ["kochi"],
    stateIds: ["kerala"],
  },
  {
    id: "malpua",
    title: "Malpua",
    coverImage: "malpua.jpg",
    slideshowImages: ["malpua1.jpg", "malpua2.jpg"],
    description:
      "A sweet pancake served with rabri or condensed milk, popular in North Indian cuisine.",
    cityIds: ["udaipur"],
    stateIds: ["rajasthan"],
  },
  {
    id: "puttu",
    title: "Puttu",
    coverImage: "puttu.jpg",
    slideshowImages: ["puttu1.jpg", "puttu2.jpg"],
    description:
      "A steamed cylindrical cake made of rice flour and coconut, typically served with curry or banana.",
    cityIds: ["munnar"],
    stateIds: ["kerala"],
  },
];
