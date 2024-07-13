"use client";

import styles from "../../../styles/common/_scoreheader.module.css"
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Scoreheader({ cluePoint, detectPoint }) {
    const router = useRouter();

    return (
        <div className={styles.scoreheader_container} >
           <div className={styles.scoreheader_cluepoint}>
                {`단서 포인트\n${cluePoint}`}
           </div>
           <div className={styles.scoreheader_cluepoint}>
                {`범인 검거 포인트\n${detectPoint}`}
           </div>
           <div className={styles.scoreheader_cluepoint}>
                {`총 포인트\n${cluePoint+detectPoint}`}
           </div>
        </div>
    )
}