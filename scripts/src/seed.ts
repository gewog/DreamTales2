import { db, pool } from "@workspace/db";
import { categoriesTable, talesTable } from "@workspace/db/schema";
import { count } from "drizzle-orm";

const categories = [
  { name: "Классика", slug: "classic", emoji: "📚" },
  { name: "Приключения", slug: "adventure", emoji: "🗺️" },
  { name: "Перед сном", slug: "bedtime", emoji: "🌙" },
];

const sampleTales = [
  {
    title: "Колобок",
    content:
      "Жили-были старик со старухой. Попросила старуха старика: «Испеки мне, старик, колобок». Старик взял муку, замесил тесто и испёк колобок.\n\nКолобок положили на окошко остужать, да не устоял — покатился с окна на крыльцо, с крыльца на землю и покатился по дороге.",
    imageUrl:
      "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=800",
    category: "Классика",
    ageGroup: "3-5",
    duration: 5,
    isFeatured: true,
    author: "Русская народная сказка",
  },
  {
    title: "Репка",
    content:
      "Посадил дед репку. Выросла репка большая-пребольшая. Стал дед тянуть репку: тянет-потянет, вытянуть не может.\n\nПозвал дед бабку. Бабка за дедку, дед за репку — тянут-потянут, не вытянут.",
    imageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    category: "Классика",
    ageGroup: "0-3",
    duration: 4,
    isFeatured: false,
    author: "Русская народная сказка",
  },
];

async function seed() {
  const [categoryCount] = await db.select({ value: count() }).from(categoriesTable);

  if (categoryCount.value === 0) {
    await db.insert(categoriesTable).values(categories);
    console.log(`Inserted ${categories.length} categories.`);
  } else {
    console.log("Categories already exist, skipping.");
  }

  const [taleCount] = await db.select({ value: count() }).from(talesTable);

  if (taleCount.value === 0) {
    await db.insert(talesTable).values(sampleTales);
    console.log(`Inserted ${sampleTales.length} sample tales.`);
  } else {
    console.log("Tales already exist, skipping.");
  }
}

seed()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    pool.end().finally(() => process.exit(1));
  });
