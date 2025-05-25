
"use server";

import { google } from "googleapis";
import { z } from "zod";
import type { YoutubeVideo } from "@/types/domain";

const youtube = google.youtube("v3");

const SearchYoutubeSchema = z.object({
  query: z.string().min(1, "La consulta de búsqueda no puede estar vacía."),
});

interface YoutubeSearchResponse {
  success: boolean;
  videos?: YoutubeVideo[];
  error?: string;
}

export async function searchYoutubeVideos(
  input: z.infer<typeof SearchYoutubeSchema>
): Promise<YoutubeSearchResponse> {
  const validation = SearchYoutubeSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("Error: La clave API de YouTube no está configurada en las variables de entorno (YOUTUBE_API_KEY).");
    return { success: false, error: "La clave API de YouTube no está configurada en el servidor." };
  }

  try {
    const response = await youtube.search.list({
      key: apiKey,
      part: ["snippet"],
      q: validation.data.query,
      type: ["video"],
      maxResults: 10, // Puedes ajustar la cantidad de resultados
      videoEmbeddable: "true",
    });

    const videos: YoutubeVideo[] = response.data.items?.map((item) => ({
      id: item.id?.videoId || `video-${Date.now()}-${Math.random()}`,
      title: item.snippet?.title || "Video sin título",
      thumbnailUrl: item.snippet?.thumbnails?.medium?.url || "https://placehold.co/320x180.png?text=Video",
      description: item.snippet?.description || "",
    })) || [];

    return { success: true, videos };

  } catch (error: any) {
    console.error("Error al buscar videos en YouTube:", error);
    let errorMessage = "Ocurrió un error al buscar videos.";
    if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `Error de la API de YouTube: ${error.response.data.error.message || 'Error desconocido de la API'}`;
    } else if (error.message) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
