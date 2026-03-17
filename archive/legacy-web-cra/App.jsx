import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page stubs
const Home       = () => <div>Home Feed</div>;
const Login      = () => <div>Login</div>;
const Register   = () => <div>Register</div>;
const Projects   = () => <div>Projects</div>;
const Profile    = () => <div>Profile</div>;
const Events     = () => <div>Events</div>;
const Articles   = () => <div>Articles</div>;
const Classes    = () => <div>Classes</div>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/projects"   element={<Projects />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/events"     element={<Events />} />
        <Route path="/articles"   element={<Articles />} />
        <Route path="/classes"    element={<Classes />} />
      </Routes>
    </BrowserRouter>
  );
}
