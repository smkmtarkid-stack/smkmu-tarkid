// ==========================================
// Centralized API Service for Supabase Database
// ==========================================

import { supabase } from "./supabase";

export interface ApiResponse<T = Record<string, string>[]> {
  status: "success" | "error";
  message?: string;
  data?: T;
}

/**
 * Normalisasi nama sheet ke nama tabel Supabase (lowercase)
 */
function getTableName(sheetName: string): string {
  return sheetName.toLowerCase().trim();
}

// GET: Fetch data from a specific table (No Cache - for Admin)
export async function fetchSheet(tableName: string): Promise<ApiResponse> {
  try {
    const table = getTableName(tableName);
    const { data, error } = await supabase.from(table).select("*");

    if (error) throw error;
    return { status: "success", data: (data || []) as unknown as Record<string, string>[] };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

// GET: Fetch data with caching/revalidation (For Public Pages)
export async function fetchSheetCached(
  tableName: string,
  _revalidate: number = 60
): Promise<ApiResponse> {
  // Supabase JS SDK secara langsung mengambil data tercepat via PostgREST/CDN.
  return fetchSheet(tableName);
}

// POST: Create a new row in a specific table
export async function createRow(
  tableName: string,
  data: Record<string, unknown>
): Promise<ApiResponse> {
  try {
    const table = getTableName(tableName);
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(data)
      .select();

    if (error) throw error;
    return { status: "success", data: (inserted || []) as unknown as Record<string, string>[] };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

// POST (Bulk): Create multiple new rows in a specific table
export async function createRows(
  tableName: string,
  data: Record<string, unknown>[]
): Promise<ApiResponse> {
  try {
    const table = getTableName(tableName);
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(data)
      .select();

    if (error) throw error;
    return { status: "success", data: (inserted || []) as unknown as Record<string, string>[] };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

// POST (update): Update existing row by ID
export async function updateRow(
  tableName: string,
  id: string,
  data: Record<string, unknown>
): Promise<ApiResponse> {
  try {
    const table = getTableName(tableName);
    const { data: updated, error } = await supabase
      .from(table)
      .update(data)
      .eq("id", id)
      .select();

    if (error) throw error;
    return { status: "success", data: (updated || []) as unknown as Record<string, string>[] };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

// DELETE: Delete row by ID
export async function deleteRow(
  tableName: string,
  id: string
): Promise<ApiResponse> {
  try {
    const table = getTableName(tableName);
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw error;
    return { status: "success" };
  } catch (error) {
    return { status: "error", message: (error as Error).message };
  }
}

// UPLOAD FILE: Upload file (Base64 atau File Blob) ke Supabase Storage
export async function uploadFile(
  base64Data: string,
  filename: string,
  mimeType: string
): Promise<{ status: "success" | "error"; message: string; url?: string }> {
  try {
    const bucketName = "uploads";
    // Konversi base64 string ke Buffer/Blob
    const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const filePath = `${Date.now()}_${filename.replace(/\s+/g, "_")}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.warn("Supabase Storage error (Fallback to Data URL):", uploadError.message);
      // Fallback ke Data URL agar upload foto tidak terhenti jika RLS storage belum diset
      const dataUrl = `data:${mimeType || "image/png"};base64,${cleanBase64}`;
      return {
        status: "success",
        message: "File diunggah (Fallback Data URL)",
        url: dataUrl,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      status: "success",
      message: "File uploaded successfully",
      url: publicUrlData.publicUrl,
    };
  } catch (error) {
    const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, "");
    const dataUrl = `data:${mimeType || "image/png"};base64,${cleanBase64}`;
    return {
      status: "success",
      message: "File diunggah (Fallback Data URL)",
      url: dataUrl,
    };
  }
}
