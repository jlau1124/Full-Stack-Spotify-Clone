import { Link } from "react-router-dom"; // <-- add this import
import type { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";

//defines a TypeScript type for the props your component expects.
  //Think of it as a contract: “if you give this component props, they must match these types.”
type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};
//({ title, songs, isLoading }: SectionGridProps) → destructures the props and enforces the type.
//TypeScript will now give an error if you pass the wrong type to SectionGrid, which helps catch bugs before runtime.
const SectionGrid = ({ songs, title, isLoading }:SectionGridProps) => {
  if(isLoading) return <SectionGridSkeleton />
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Button asChild variant="link" className="text-sm text-zinc-400 hover:text-white">
          <Link to="/albums">Show all</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div key={song._id} 
          className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor pointer"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img src={song.imageUrl} alt={song.title}
                className="w-full h-full object-cover transition-transform duration-300 
                group-hover:scale-105"
                />
              </div>
              <PlayButton song={song} />
            </div>
            <h3 className="font-medium mb-2 truncate">
              {song.title}
            </h3>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        ))}
        
      </div>
    </div>
  )
};

export default SectionGrid;