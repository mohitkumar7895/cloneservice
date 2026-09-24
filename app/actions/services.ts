"use server";

import pool from "../../lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs";

export async function saveService(formData: FormData) {
  const category_id = formData.get("category_id") as string;
  const subcategory_id = formData.get("subcategory_id") as string;
  const title = formData.get("title") as string;
  const original_price = formData.get("original_price") as string;
  const selling_price = formData.get("selling_price") as string;
  const rating = formData.get("rating") as string || "0.0";
  const warranty_days = formData.get("warranty_days") as string || "180";
  const warranty_description = formData.get("warranty_description") as string || "";
  const short_description = formData.get("short_description") as string || "";
  const long_description = formData.get("long_description") as string || "";
  
  const image = formData.get("image") as File | null;
  let imageUrl = "";

  let shouldRedirect = false;

  try {
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = image.type || "image/png";
      imageUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    const query = `
      INSERT INTO services (
        category_id, subcategory_id, title, original_price, selling_price, 
        rating, warranty_days, warranty_description, short_description, long_description, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await pool.query(query, [
      parseInt(category_id),
      parseInt(subcategory_id),
      title,
      original_price ? parseFloat(original_price) : null,
      parseFloat(selling_price),
      rating,
      parseInt(warranty_days),
      warranty_description,
      short_description,
      long_description,
      imageUrl || null
    ]);
    shouldRedirect = true;
  } catch (error) {
    console.error("Error saving service:", error);
    return { error: error instanceof Error ? error.message : "Failed to save service" };
  }

  if (shouldRedirect) {
    revalidatePath("/admin/services");
    redirect("/admin/services");
  }

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateService(formData: FormData) {
  const id = formData.get("id") as string;
  const category_id = formData.get("category_id") as string;
  const subcategory_id = formData.get("subcategory_id") as string;
  const title = formData.get("title") as string;
  const original_price = formData.get("original_price") as string;
  const selling_price = formData.get("selling_price") as string;
  const rating = formData.get("rating") as string || "0.0";
  const warranty_days = formData.get("warranty_days") as string || "180";
  const warranty_description = formData.get("warranty_description") as string || "";
  const short_description = formData.get("short_description") as string || "";
  const long_description = formData.get("long_description") as string || "";
  
  const image = formData.get("image") as File | null;

  let shouldRedirect = false;

  try {
    let query = `
      UPDATE services SET 
        category_id = ?, subcategory_id = ?, title = ?, original_price = ?, selling_price = ?, 
        rating = ?, warranty_days = ?, warranty_description = ?, short_description = ?, long_description = ?
    `;
    
    let params: any[] = [
      parseInt(category_id), parseInt(subcategory_id), title, 
      original_price ? parseFloat(original_price) : null, parseFloat(selling_price), 
      rating, parseInt(warranty_days), warranty_description, short_description, long_description
    ];

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
    console.error("Error updating service:", error);
    return { error: error instanceof Error ? error.message : "Failed to update service" };
  }

  if (shouldRedirect) {
    revalidatePath("/admin/services");
    redirect("/admin/services");
  }
}

export async function deleteService(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    await pool.query("DELETE FROM services WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting service:", error);
  }

  revalidatePath("/admin/services");
}
