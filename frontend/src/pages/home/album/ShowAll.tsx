import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";

const ShowAll = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();

  useEffect(() => {
    fetchAlbums(); // fetch all albums when page loads
  }, [fetchAlbums]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="h-full bg-zinc-900">
      <ScrollArea className="h-full p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {albums.map((album) => (
            <Link key={album._id} to={`/albums/${album._id}`}>
              <div className="bg-zinc-800 p-2 rounded hover:bg-zinc-700 transition">
                <img
                  src={album.imageUrl}
                  alt={album.title}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="mt-2 text-white font-medium">{album.title}</div>
                <div className="text-sm text-zinc-400">{album.artist}</div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ShowAll;
