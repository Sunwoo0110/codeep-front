'use client';

import styles from "./page.module.css";
import Main from "./main/page";
import { useState, useEffect } from "react"

export default function Home() {

  const [isMobile, setIsMobile] = useState(false);

  const getIsMobile = () => {
    const userAgent = window.navigator.userAgent;
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    return isMobile;
  };

  useEffect(() => {
    setIsMobile(getIsMobile());
  }, [isMobile])

  return (
    <>
    {isMobile && 
      <div className={styles.container}>
        <Main />
      </div>
    }
    </>
  )
}