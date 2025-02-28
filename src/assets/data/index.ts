const tags = [
  { name: "trending", id: 1 },
  { name: "news article", id: 2 },
  { name: "xbox x", id: 3 },
  { name: "ps5", id: 4 },
];

const coverImage =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ55eLufoCUmSvGLyuAejuXKFsaJ-AVX6KfgA&usqp=CAU";

// Generate an array of 40 objects with random data
export const newsArray: any[] = [];

for (let i = 1; i <= 40; i++) {
  const randomTag1 = tags[Math.floor(Math.random() * tags.length)];
  const randomTag2 = tags[Math.floor(Math.random() * tags.length)];

  newsArray.push({
    id: i,
    coverImage: coverImage,
    title: `Random News ${i}`,
    desc: `Description for Random News ${i}`,
    featured: i == 13 ? true : false,
    tags: [randomTag1, randomTag2],
    commentsCount: Math.floor(Math.random() * 100),
    createdAt: "2023-09-08",
    user: {
      id: Math.floor(Math.random() * 1000) + 1,
      name: `User${i}`,
      avatar: `https://i.pinimg.com/280x280_RS/77/0f/b7/770fb75f5e81e4c2dbe8934f246aeeab.jpg`,
    },
    link: `https://example.com/news/${i}`,
  });
}
