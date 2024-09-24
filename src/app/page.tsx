import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <Link href={`/login`}>
      <button>Go to login please</button>
    </Link>
  );
}
