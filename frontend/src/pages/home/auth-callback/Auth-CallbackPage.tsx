import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";


const AuthCallbackPage = () => {
  //check if user is loaded
    //useUser is a clerk hook which gives you info abotu the currently signed-in user
    //isLoaded tells you if Clerk has finished loading user data and user contains the actual user object(id, name, etc)
    const {isLoaded, user} = useUser();
    
    //useNavigate() is from React Router. It gives you a function to redirect the user to a different page.
    const navigate = useNavigate();

    //opitonal optimization to take care of the useeffect creating the user twice  
    const syncAttempted = useRef(false);

  //react hook rusn code after the component renders. here it will check the user's status and sync them with the backend
    useEffect(() =>{
    //whenever we go to the auth/call back page if the user is loggining 1st time then save in the database
    const syncUser = async () => {
       //if user is not loaded or if there isn't a user or if the sync function already ran once return <-- exit out of the funciton 
      if (!isLoaded || !user || syncAttempted.current) return;
      
      try{
        //marks that the sync has alr happened
        //Basically, it’s a flag to ensure your sync logic only runs once, look at the comment for the syncAttmpeted
         syncAttempted.current = true;  


      //if user authetnicated
      //Calls your backend’s /auth/callback route with a POST request.
      //It sends the user’s details (id, name, profile pic) so your database can store them.
        //(JS note: await pauses until the request finishes.)   
      await axiosInstance.post("/auth/callback", {
        id:user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl
      });
      } catch(error){
          console.log("Error in auth callback", error);
        //redirect the user to homepage whether it succeded or failed 
      } finally{
          navigate("/", )
      }
    };  


    //calls the function 
     syncUser();
     //Dependency array for useEffect.
      //This means React will re-run the effect whenever isLoaded, user, or navigate changes.
  }, [isLoaded, user, navigate]);
  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      {/* shadcn component*/}
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
        <Loader className="size-6 text-emerald-500 animate-spin"/>
        <h3 className="text-zinc-400 text-xl font-bold">Logging you in</h3>
        <p className="text-zinc-400 text-sm">Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  )
};

export default AuthCallbackPage;