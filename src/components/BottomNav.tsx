import React from "react";
import styles from "./../styles/BottomNav.module.css";

interface BottomNavProps {
  active: "map" | "info";
  onChange: (screen: "map" | "info") => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ active, onChange }) => {
  return (
    <nav className={styles.bottomNav}>
      <button
        className={`${styles.navBtn} ${active === "map" ? styles.active : ""}`}
        onClick={() => onChange("map")}
      >
        <i className={styles.Map}></i>
        <span>Карта</span>
      </button>

      <button
        className={`${styles.navBtn} ${active === "info" ? styles.active : ""}`}
        onClick={() => onChange("info")}
      >
        <i className={styles.userInfo}></i>
        <span>Инфо</span>
      </button>
    </nav>
  );
};

export default BottomNav;