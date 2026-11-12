import { desc } from "drizzle-orm";

import { getDb } from "#db/index";
import { imageLibrary, users } from "#db/schema";
import { ensureTables } from "#lib/server/db";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
  try {
    await ensureTables(platform?.env?.DB);
    const db = getDb(platform?.env?.DB);
    const [images, userList] = await Promise.all([
      db.query.imageLibrary.findMany({
        orderBy: [desc(imageLibrary.createdAt)]
      }),
      db
        .select({
          id: users.id,
          name: users.name,
          username: users.username,
          avatarUrl: users.avatarUrl
        })
        .from(users)
    ]);

    const userMap = new Map(userList.map((u) => [u.id, u]));

    return {
      images: images.map((img) => {
        const uploader = img.uploaderId ? userMap.get(img.uploaderId) : undefined;
        return {
          ...img,
          uploaderName: uploader?.name || uploader?.username || null,
          uploaderAvatarUrl: uploader?.avatarUrl || null
        };
      })
    };
  } catch (err) {
    console.error("Error loading image library:", err);
    return { images: [] };
  }
};
