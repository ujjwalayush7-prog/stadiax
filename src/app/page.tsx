import Link from "next/link";
import { UserRound, ShieldHalf } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className="text-gradient">StadiaX</h1>
        <p>FIFA World Cup 2026 GenAI Operations</p>
      </div>
      
      <div className={styles.cardContainer}>
        <Link href="/fan" className={`glass-panel ${styles.card}`}>
          <UserRound size={48} className={styles.icon} color="var(--neon-green)" />
          <h2>Fan Experience</h2>
          <p>Access your tickets, live scores, stadium navigation, and StadiaBot assistance.</p>
        </Link>
        
        <Link href="/staff" className={`glass-panel ${styles.card}`}>
          <ShieldHalf size={48} className={styles.icon} color="var(--primary-purple)" />
          <h2>Staff Operations</h2>
          <p>Monitor crowd control, operational intelligence, and real-time decision support.</p>
        </Link>
      </div>
    </main>
  );
}
