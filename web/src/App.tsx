import { Routes, Route } from 'react-router-dom';

// Pages (stubs — flesh out per feature)
const Home = () => <div>Home Feed</div>;
const Projects = () => <div>Projects Marketplace</div>;
const Profile = () => <div>Creator Profile</div>;
const Classes = () => <div>Acting Classes</div>;
const Events = () => <div>Events</div>;
const Articles = () => <div>Articles</div>;
const Login = () => <div>Login</div>;
const SignUp = () => <div>Sign Up</div>;
const Apply = () => <div>Creator Application</div>;
const NotFound = () => <div>404 – Page Not Found</div>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/events" element={<Events />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
