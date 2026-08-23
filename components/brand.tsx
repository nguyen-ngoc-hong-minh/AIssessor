import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Aissessor home">
      <span className="brand-text">Aissessor</span>
    </Link>
  );
}
