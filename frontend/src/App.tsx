import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/home/HomePage";
import AuthCallbackPage from "./pages/home/auth-callback/Auth-CallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layouts/MainLayout";
import ChatPage from "./pages/home/chat/ChatPage";
import AlbumPage from "./pages/home/album/AlbumPage";
import AdminPage from "./pages/home/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/home/404/NotFoundPage";
import ShowAll from "./pages/home/album/ShowAll";



function App() {
  //token => 
  
  return (
    <>
    <Routes>
      <Route path="/sso-callback" element={< AuthenticateWithRedirectCallback 
      signUpForceRedirectUrl={"/auth-callback"}
      />} />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route path="/admin" element={<AdminPage />} />  
      <Route element={< MainLayout />}>
        <Route path="/" element={< HomePage />} />
        <Route path="/chat" element={< ChatPage />} />
        <Route path="/albums" element={<ShowAll />} />
        <Route path="/albums/:albumId" element={< AlbumPage />} />
        <Route path="*" element={< NotFoundPage />} />
      </Route>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App
