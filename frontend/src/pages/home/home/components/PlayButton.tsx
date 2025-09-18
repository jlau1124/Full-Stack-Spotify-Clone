import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import type { Song } from "@/types";
import { Pause, Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
    // Pull state + actions from our store
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	
    // Check if the song tied to this button is the one currently active
    const isCurrentSong = currentSong?._id === song._id;

    // Handle button clicks
	const handlePlay = () => {
		if (isCurrentSong) togglePlay(); // pause/play if same song
		else setCurrentSong(song); // switch to new song
	};

	return (
		<Button
			size={"icon"}
			onClick={handlePlay}
			className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
				opacity-0 translate-y-2 group-hover:translate-y-0 ${
					isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
		>
			{isCurrentSong && isPlaying ? (
				<Pause className='size-5 text-black' />
			) : (
				<Play className='size-5 text-black' />
			)}
		</Button>
	);
};
export default PlayButton;