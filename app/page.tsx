import Image from "next/image";
import connectToDB from "@/utils/db";
import styles from "./page.module.css";

export default async function Home() {
  await connectToDB();

  return (
    <main className={styles.main}>
      <h1>Start page</h1>
    </main>
  );
}
