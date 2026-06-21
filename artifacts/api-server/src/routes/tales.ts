import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { talesTable, categoriesTable, insertTaleSchema } from "@workspace/db/schema";
import { eq, ilike, and, sql } from "drizzle-orm";
import { requireAdminAuth } from "../middleware/admin-auth";

const router: IRouter = Router();

router.get("/tales", async (req, res) => {
  try {
    const { category, ageGroup, search } = req.query as {
      category?: string;
      ageGroup?: string;
      search?: string;
    };

    const conditions = [];
    if (category) conditions.push(eq(talesTable.category, category));
    if (ageGroup) conditions.push(eq(talesTable.ageGroup, ageGroup));
    if (search) conditions.push(ilike(talesTable.title, `%${search}%`));

    const tales = await db
      .select()
      .from(talesTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(talesTable.createdAt);

    res.json(tales);
  } catch (err) {
    req.log.error(err, "Error fetching tales");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tales/stats/summary", async (req, res) => {
  try {
    const [totalTalesResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(talesTable);
    const [totalCategoriesResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(categoriesTable);
    const [featuredCountResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(talesTable)
      .where(eq(talesTable.isFeatured, true));

    const ageGroupRows = await db
      .select({
        ageGroup: talesTable.ageGroup,
        count: sql<number>`count(*)::int`,
      })
      .from(talesTable)
      .groupBy(talesTable.ageGroup);

    res.json({
      totalTales: totalTalesResult.count,
      totalCategories: totalCategoriesResult.count,
      featuredCount: featuredCountResult.count,
      ageGroups: ageGroupRows,
    });
  } catch (err) {
    req.log.error(err, "Error fetching summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tales/featured", async (req, res) => {
  try {
    const tales = await db
      .select()
      .from(talesTable)
      .where(eq(talesTable.isFeatured, true))
      .orderBy(talesTable.id);

    if (tales.length === 0) {
      res.json([]);
      return;
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
    const dailyTale = tales[dayOfYear % tales.length];

    res.setHeader("Cache-Control", "no-store");
    res.json([dailyTale]);
  } catch (err) {
    req.log.error(err, "Error fetching featured tales");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tales/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [tale] = await db.select().from(talesTable).where(eq(talesTable.id, id));
    if (!tale) {
      res.status(404).json({ error: "Tale not found" });
      return;
    }
    res.json(tale);
  } catch (err) {
    req.log.error(err, "Error fetching tale");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/tales", requireAdminAuth, async (req, res) => {
  try {
    const parsed = insertTaleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
      return;
    }
    const [tale] = await db.insert(talesTable).values(parsed.data).returning();
    res.status(201).json(tale);
  } catch (err) {
    req.log.error(err, "Error creating tale");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/tales/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const parsed = insertTaleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
      return;
    }
    const [updated] = await db
      .update(talesTable)
      .set(parsed.data)
      .where(eq(talesTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Tale not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error(err, "Error updating tale");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/tales/:id", requireAdminAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    await db.delete(talesTable).where(eq(talesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Error deleting tale");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.id);
    res.json(categories);
  } catch (err) {
    req.log.error(err, "Error fetching categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
