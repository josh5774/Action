import { Link, Route, Routes } from 'react-router-dom';

type PageProps = {
  title: string;
  description: string;
};

function Page({ title, description }: PageProps) {
  return (
    <section className="page">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

function Layout() {
  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">FilmLink</p>
        <h1>NYC film community marketplace</h1>
        <p className="lede">
          Canonical Vite web app scaffold. The repo now has one clear frontend entrypoint.
        </p>
      </header>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/classes">Classes</Link>
        <Link to="/events">Events</Link>
        <Link to="/articles">Articles</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/apply">Apply</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Page title="Home Feed" description="Featured creators, projects, and community activity." />} />
        <Route path="/projects" element={<Page title="Projects Marketplace" description="Open casting calls, crew searches, and collaboration posts." />} />
        <Route path="/profile" element={<Page title="Creator Profile" description="Portfolio, credits, reel, and follow graph." />} />
        <Route path="/classes" element={<Page title="Acting Classes" description="Discover partner classes and reviews." />} />
        <Route path="/events" element={<Page title="Events" description="Mixers, screenings, workshops, and panels." />} />
        <Route path="/articles" element={<Page title="Articles" description="Editorial coverage, interviews, and community news." />} />
        <Route path="/login" element={<Page title="Login" description="Sign in to your FilmLink account." />} />
        <Route path="/signup" element={<Page title="Sign Up" description="Create a new FilmLink account." />} />
        <Route path="/apply" element={<Page title="Creator Application" description="Submit your creative profile for approval." />} />
        <Route path="*" element={<Page title="404" description="Page not found." />} />
      </Routes>
    </div>
  );
}

export default Layout;
