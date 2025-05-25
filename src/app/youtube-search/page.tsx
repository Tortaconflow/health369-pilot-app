
"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { searchYoutubeVideos } from "@/app/actions/youtubeActions";
import type { YoutubeVideo } from "@/types/domain";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, YoutubeIcon, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function YoutubeSearchPage() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Consulta Vacía",
        description: "Por favor, ingresa un término de búsqueda.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideos([]);

    try {
      const result = await searchYoutubeVideos({ query });
      if (result.success && result.videos) {
        setVideos(result.videos);
        if (result.videos.length === 0) {
          toast({
            title: "Sin Resultados",
            description: "No se encontraron videos para tu búsqueda.",
          });
        }
      } else {
        setError(result.error || "No se pudo obtener una respuesta del servidor.");
        toast({
          title: "Error de Búsqueda",
          description: result.error || "Ocurrió un error al buscar videos.",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      setError(errorMessage);
      toast({
        title: "Error Inesperado",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader className="text-center">
           <div className="inline-block p-3 bg-destructive/10 rounded-full mx-auto mb-3"> {/* YouTube red */}
            <YoutubeIcon className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Buscar Videos en YouTube</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Encuentra videos de ejercicios, recetas y más.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-8">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: ejercicios para abdomen, receta de ensalada..."
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span className="ml-2 sr-only sm:not-sr-only">Buscar</span>
            </Button>
          </form>

          {error && (
            <div className="p-4 mb-4 text-sm text-destructive-foreground bg-destructive rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" /> {error}
            </div>
          )}

          {videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      width={320}
                      height={180}
                      className="w-full h-auto aspect-video object-cover"
                      data-ai-hint="video thumbnail"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-md line-clamp-2 text-primary hover:underline">{video.title}</h3>
                      {video.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{video.description}</p>}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
