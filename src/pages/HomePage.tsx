import { Link } from "react-router";
import { routes } from "../constants/routes";

const HomePage = () => {
  return (
    <article>
      <header className="text-3xl font-bold">Home Page</header>
      <nav className="flex flex-col gap-2 indent-4">
        <Link to={routes.MagnetismPage} className="hover:text-indigo-600">
          Magnetism
        </Link>
        <Link to={routes.ElectroMagnetism} className="hover:text-indigo-600">
          ElectroMagnetism
        </Link>
      </nav>
    </article>
  );
};

export default HomePage;
