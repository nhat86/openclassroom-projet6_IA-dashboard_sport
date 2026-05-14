import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notFound">
      <h1 className="notFoundTitle">404</h1>

      <p className="notFoundText">
        Cette page n'existe pas.
      </p>

      <Link href="/" className="notFoundButton">
        Retour accueil
      </Link>
    </div>
  );
}