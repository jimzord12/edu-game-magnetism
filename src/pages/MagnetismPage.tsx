import { Link } from "react-router";
import { routes } from "../constants/routes";

const MagnetismPage = () => {
  return (
    <article>
      <header className="text-3xl font-bold">Magnetism Page</header>
      <nav className="flex flex-col gap-2 indent-4">
        <Link to={routes.ElectroMagnetism} className="hover:text-indigo-600">
          Electro-magnetism
        </Link>
        <Link to={routes.HomePage} className="hover:text-indigo-600">
          Home
        </Link>
      </nav>
    </article>
  );
};

export default MagnetismPage;
