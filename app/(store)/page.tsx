import Image from "next/image";
import connectToDB from "@/utils/db";
import styles from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web shop Start page",
  description: "",
};

export default async function Home() {
  // await connectToDB();

  return (
    <main className={styles.main}>
      <h1>Store start page</h1>
    </main>
  );
}
