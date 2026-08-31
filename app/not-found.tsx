import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
      <h2 className="text-3xl font-bold mb-4">404 - Page Non Trouvée</h2>
      <p className="text-slate-400 mb-6">La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
