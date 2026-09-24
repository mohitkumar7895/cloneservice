"use server";

import pool from "../../lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs";

export async function saveSubcategory(formData: FormData) {
  const categoryId = formData.get("category_id") as string;
  const title = formData.get("title") as string;
  const image = formData.get("image") as File | null;

  let shouldRedirect = false;

  try {
    let imageUrl = "";

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = image.type || "image/png";
      imageUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    const query = `
      INSERT INTO subcategories (category_id, title, image_url)
      VALUES (?, ?, ?)
    `;
    
    await pool.query(query, [parseInt(categoryId), title, imageUrl]);
    shouldRedirect = true;
  } catch (error) {
    console.error("Error saving subcategory:", error);
    return { error: error instanceof Error ? error.message : "Failed to save subcategory" };
  }

  if (shouldRedirect) {
    revalidatePath("/admin/subcategories");
    redirect("/admin/subcategories");
  }
}

export async function updateSubcategory(formData: FormData) {
  const id = formData.get("id") as string;
  const categoryId = formData.get("category_id") as string;
  const title = formData.get("title") as string;
  const image = formData.get("image") as File | null;

  let shouldRedirect = false;

  try {
    let query = `
      UPDATE subcategories 
      SET category_id = ?, title = ?
    `;
    let params: any[] = [parseInt(categoryId), title];

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = image.type || "image/png";
      const imageUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      query += `, image_url = ?`;
      params.push(imageUrl);
    }

    query += ` WHERE id = ?`;
    params.push(id);

    await pool.query(query, params);
    shouldRedirect = true;
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return { error: error instanceof Error ? error.message : "Failed to update subcategory" };
  }

  if (shouldRedirect) {
    revalidatePath("/admin/subcategories");
    redirect("/admin/subcategories");
  }
}

export async function deleteSubcategory(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    // Optionally fetch image_url and delete the file here if desired
    await pool.query("DELETE FROM subcategories WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting subcategory:", error);
  }

  revalidatePath("/admin/subcategories");
}
