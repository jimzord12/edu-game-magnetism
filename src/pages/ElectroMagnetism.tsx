import { Link } from "react-router";
import { routes } from "../constants/routes";
import ElectroMagnetsGame from "../games/electroMagnets/ElectroMagnetsGame";

const ElectroMagnetism = () => {
  return (
    <article>
      <header className="text-3xl font-bold">Electro-magnetism Page</header>
      <nav className="flex flex-col gap-2 indent-4">
        <Link to={routes.MagnetismPage} className="hover:text-indigo-600">
          Magnetism
        </Link>
        <Link to={routes.HomePage} className="hover:text-indigo-600">
          Home
        </Link>
      </nav>

      <div>
        <ElectroMagnetsGame canvasW={800} canvasH={400} />
      </div>
    </article>
  );
};

export default ElectroMagnetism;
