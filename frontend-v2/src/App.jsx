import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "regenerator-runtime/runtime";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import Features from "./pages/Features";
import Chefs from "./pages/Chefs";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import Leaderboard from "./pages/Leaderboard";
import ChefChat from "./pages/ChefChat";
import MobileNav from "./components/MobileNav";

function AppContent() {
  const location = useLocation();
  const noHeaderPaths = [
    "/home",
    "/create-recipe",
    "/recipe/1",
    "/leaderboard",
    "/chef-chat",
  ];
  const shouldShowHeader = !noHeaderPaths.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith("/recipe/"),
  );

  return (
    <div className="min-h-screen min-w-screen w-full bg-white">
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/chefs" element={<Chefs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/chef-chat" element={<ChefChat />} />
      </Routes>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
