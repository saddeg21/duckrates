import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const CATEGORIES = ["AI", "Tech", "Philosophy", "Sociology", "Politics"];

function pickRandom(arr, min = 1, max = 2) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function main() {
  const posts = await prisma.post.findMany({
    where: { categories: { isEmpty: true } },
    select: { id: true, title: true },
  });

  console.log(`Boş kategorili post sayısı: ${posts.length}`);
  if (posts.length === 0) {
    console.log("Yapılacak bir şey yok.");
    return;
  }

  for (const post of posts) {
    const categories = pickRandom(CATEGORIES, 1, 2);
    await prisma.post.update({
      where: { id: post.id },
      data: { categories },
    });
    console.log(`  ✓ "${post.title}" → [${categories.join(", ")}]`);
  }

  console.log("Tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
