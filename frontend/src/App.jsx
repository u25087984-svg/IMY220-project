import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Splash from "./pages/Splash";
import SignInForm from "./pages/SignInForm";
import SignUpForm from "./pages/SignUpForm";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostPage from "./pages/PostPage";
import Albums from "./pages/Albums";
import AlbumPage from "./pages/AlbumPage";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
    const location = useLocation();
    const isSplash = location.pathname === "/";
  return (
        <div className={`min-h-screen flex flex-col ${isSplash ? "bg-black" : "bg-[url('/Urban_gif.gif')] bg-cover bg-fixed bg-center"}`}>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/:username/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/posts/:id/edit" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
          <Route path="/posts/:id" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
          <Route path="/albums" element={<ProtectedRoute><Albums /></ProtectedRoute>} />
          <Route path="/albums/:id" element={<ProtectedRoute><AlbumPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}