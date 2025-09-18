import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";

const LeftSidebar = () => {
  
  //useMusicStore() hooks into the store in your React component.
  //You can now:
    //Access state (songs, albums, fetchalbums is function to fetch albums from backend)
    //is loading is a boolean that tells if the fetch is in progress 
    //Call functions (fetchAlbums) to update the state
  const { albums, fetchAlbums, isLoading} = useMusicStore();

  useEffect(() => {
    fetchAlbums()
    }, [fetchAlbums]);

  console.log({ albums }); 

  return <div className="h-full flex flex-col gap-2">
    {/*  Navigation Menu */}

    <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
            {/* take us to home page */}
            <Link to={"/"} className={cn(buttonVariants(
                {
                    //Applies a specific button style defined in your project.
                    variant: "ghost",
                    //Adds extra Tailwind classes on top.
                    className: "w-full justify-start text-white hover:bg-zinc=800",
                }
            ))}>
            <HomeIcon className="mr-2 size-5"/>
            <span className="hidden md:inline">Home</span>
            </Link>
            {/* we put the message page in the SignedIn component because we don't want someone who isn't signed in or authenticated, they shouldn't be able to message people*/}
            <SignedIn>
                {/*messages */}
            <Link to={"/chat"} className={cn(buttonVariants(
                {
                    //Applies a specific button style defined in your project.
                    variant: "ghost",
                    //Adds extra Tailwind classes on top.
                    className: "w-full justify-start text-white hover:bg-zinc=800",
                }
            ))}>
            <MessageCircle className="mr-2 size-5"/>
            <span className="hidden md:inline">Messages</span>
            </Link>
            </SignedIn>
        </div>
    </div>

    {/*  Library Section */}
    <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-white px-2">
                <Library className="size-5 mr-2"/>
                <span className="hidden md:inline">Playlists</span>
            </div>
        </div>
        <div>
            {/* adds a scroll bar basically */}
            <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2">{isLoading ? <PlaylistSkeleton/>: (
                    albums.map((album) => (
                       <Link to={`/albums/${album._id}`} 
                        key={album._id}
                        className="p-2 hover:bg-zinc-800 rounded-md flex items-cetner gap-3 group cursor-pointer"
                        >
                        <img src={album.imageUrl} alt="Playlist" 
                        className="size-12 rounded-md flex-shrink-0 object-cover"/>

                        <div className="flex-1 min-w-0 hidden md:block">
                            <p className="font-medium truncate">
                                {album.title}
                            </p>
                            <p className="text-sm text-zinc-400 truncate">
                             Album • {album.artist}
                            </p>
                        </div>
                        </Link>
                    ))  
                )}</div>
            </ScrollArea>
        </div>
    </div>
  </div>;
}

export default LeftSidebar;
