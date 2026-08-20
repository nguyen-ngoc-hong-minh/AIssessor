import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="AIssessor home">
      <span className="logo" />
      <span className="brand-text">AIssessor</span>
    </Link>
  );
}
