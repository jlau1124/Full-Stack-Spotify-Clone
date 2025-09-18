import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Helper function to convert seconds to "minutes:seconds" format
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Component that shows playback controls and song info
export const PlaybackControls = () => {
  const {
    currentSong,      
    isPlaying,        
    togglePlay,      
    playNext,        
    playPrevious,     
    isShuffling,      
    toggleShuffle,    
    isRepeating,      
    toggleRepeat,     
  } = usePlayerStore();

  const [volume, setVolume] = useState(75);      
  const [currentTime, setCurrentTime] = useState(0); 
  const [duration, setDuration] = useState(0);       
  const audioRef = useRef<HTMLAudioElement | null>(null); 


  useEffect(() => {
    audioRef.current = document.querySelector("audio"); 
    const audio = audioRef.current;
    if (!audio) return;

    
    const updateTime = () => setCurrentTime(audio.currentTime);

    // Update duration once metadata is loaded
    const updateDuration = () => setDuration(audio.duration);

    // Handle what happens when song ends
    const handleEnded = () => {
      if (isRepeating && audioRef.current) {
        audioRef.current.currentTime = 0; // restart song if repeating
        audioRef.current.play();
      } else {
        playNext(); // otherwise play next song
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    // Clean up event listeners when component unmounts or song changes
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, isRepeating]);

  // When user drags the slider, seek to that time in the song
  const handleSeek = (value: number[]) => {
    if (audioRef.current) audioRef.current.currentTime = value[0];
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* Song Info (image, title, artist) */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-14 h-14 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </div>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Shuffle button */}
            <Button
              size="icon"
              variant="ghost"
              className={`hidden sm:inline-flex ${isShuffling ? "text-emerald-400" : "text-zinc-400"}`}
              onClick={toggleShuffle}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            {/* Previous song */}
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            {/* Play/Pause */}
            <Button
              size="icon"
              className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8"
              onClick={togglePlay}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            {/* Next song */}
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Repeat button */}
            <Button
              size="icon"
              variant="ghost"
              className={`hidden sm:inline-flex ${isRepeating ? "text-emerald-400" : "text-zinc-400"}`}
              onClick={toggleRepeat}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Song progress slider */}
          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
              onValueChange={handleSeek}
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>

        {/* Volume and extra controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
            <Mic2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
            <Laptop2 className="h-4 w-4" />
          </Button>

          {/* Volume slider */}
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="hover:text-white text-zinc-400">
              <Volume1 className="h-4 w-4" />
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) audioRef.current.volume = value[0] / 100; // update audio volume
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
