import { Button } from "@/components/ui/button";
import { useMusicStore } from "@/stores/useMusicStore"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

interface NewSong {
	title: string;
	artist: string;
	album: string;
	duration: string;
}
const AddSongDialog = () => {

  const { albums }  = useMusicStore();
  const [songDialogOpen, setSongDialogOpen]= useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [newSong, setNewSong] = useState<NewSong>({
    title: "",
    artist: "",
    album:"",
    duration: "0",
  });

  //keep track of the files <= audio files and image file 
  const [files, setFiles] = useState<{ audio: File | null, image: File | null }>({
    audio:null,
    image:null,
  });


  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
        //if either one of the audio or image file isn't uploaded 
        if(!files.audio || !files.image) {
            //show toast error
            return toast.error("Please upload both audio and image files");
        }
        // send data to backend 
        const formData = new FormData();

        //send the title of the song 
        formData.append("title", newSong.title);
        //artist 
		formData.append("artist", newSong.artist);
        //duration
		formData.append("duration", newSong.duration);
        //if new song isn't equal to none 
        if (newSong.album && newSong.album !== "none") {
            //attach the an album id to the form data  
				formData.append("albumId", newSong.album);
		}

        //add the audio file <= "how we accept this in the admin.controller.js"
        formData.append("audioFile", files.audio);
        //add the image file
		formData.append("imageFile", files.image);
        
        //send our req using axiosInstance
		await axiosInstance.post("/admin/songs", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
	   });

       //reset dialog data 
        setNewSong({
				title: "",
				artist: "",
				album: "",
				duration: "0",
		});
        

        //set the files to be reset
		setFiles({
			audio: null,
			image: null,
		});
        //show a toast message 
		toast.success("Song added successfully");
    } catch (error: any){
        toast.error("Failed to add song: " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return ( 
    //go over what goes inside the dialog component 
  <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
        {/* trigger the dialog*/}
        <DialogTrigger asChild>
            <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
                <Plus className='mr-2 h-4 w-4' />
                Add Song
            </Button>
        </DialogTrigger>

        <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
            <DialogHeader>
				<DialogTitle>Add New Song</DialogTitle>
				<DialogDescription>Add a new song to your music library</DialogDescription>
			</DialogHeader>

            <div className="space-y-4 py-4">
                {/* to select an audio file  */}
                <input 
                type="file"
                accept="audio/*"
                ref={audioInputRef}
                hidden
                onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
                />

                <input
					type='file'
					ref={imageInputRef}
					className='hidden'
					accept='image/*'
					onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
				/>

                {/* image upload area <== go over and study this 6:26:30 */}
                <div
					className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
					onClick={() => imageInputRef.current?.click()}
				>
					<div className='text-center'>
						{files.image ? (
							<div className='space-y-2'>
								<div className='text-sm text-emerald-500'>Image selected:</div>
								<div className='text-xs text-zinc-400'>{files.image.name.slice(0, 20)}</div>
							</div>
						) : (
							<>
								<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
									<Upload className='h-6 w-6 text-zinc-400' />
								</div>
								<div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
								<Button variant='outline' size='sm' className='text-xs'>
									Choose File
								</Button>
							</>
						)}
					</div>
				</div>

                {/* Audio upload */}
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Audio File</label>
					<div className='flex items-center gap-2'>
						<Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full'>
							{files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
						</Button>
					</div>
				</div>

                {/* other fields */}
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Title</label>
					<Input
						value={newSong.title}
						onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
						className='bg-zinc-800 border-zinc-700'
					/>
				</div>

                {/* artist name*/}
                <div className='space-y-2'>
					<label className='text-sm font-medium'>Artist</label>
					<Input
						value={newSong.artist}
						onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
						className='bg-zinc-800 border-zinc-700'
					/>
				</div> 

                {/* duration field as well*/}
                <div className='space-y-2'>
					<label className='text-sm font-medium'>Duration (seconds)</label>
					<Input
						type='number'
						min='0'
						value={newSong.duration}
						onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
						className='bg-zinc-800 border-zinc-700'
					/>
				</div>

                {/* album field */}
                <div className='space-y-2'>
					<label className='text-sm font-medium'>Album (Optional)</label>
                    <Select
                        value={newSong.album}
                        onValueChange={(value) => setNewSong({ ...newSong, album: value })}
                    >
                        <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                            <SelectValue placeholder='Select album' />
                        </SelectTrigger>
                        <SelectContent className='bg-zinc-800 border-zinc-700'>
                            <SelectItem value='none'>No Album (Single)</SelectItem>
                            {albums.map((album) => (
                                <SelectItem key={album._id} value={album._id}>
                                    {album.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
			    </div>  
            </div>

            <DialogFooter>
				<Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} disabled={isLoading}>
					{isLoading ? "Uploading..." : "Add Song"}
				</Button>
			</DialogFooter>
        </DialogContent>
  </Dialog>
  );
};

export default AddSongDialog;