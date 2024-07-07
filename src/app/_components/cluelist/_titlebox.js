"use client";

import styles from "@/styles/cluelist/_titlebox.module.css"
import { usePathname, useRouter } from 'next/navigation';

export default function Titlebox({title, storyTitle, cluePoint}) {

    return (
        <div className={styles.titlebox_container}>
            <div className={styles.titlebox_text}>
                {title}
            </div>
            <div className={styles.titlebox_storytitle}>
                {storyTitle}
            </div>
            <div className={styles.titlebox_cluePoint}>
                {`Total Point: ${cluePoint}`}
            </div>
        </div>
    )
}