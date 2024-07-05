"use client";

import styles from "../../../styles/detail/_titlebox.module.css"
import { usePathname, useRouter } from 'next/navigation';

export default function Titlebox({title}) {

    return (
        <div className={styles.titlebox_container}>
            <div className={styles.titlebox_text}>
                {title}
            </div>
        </div>
    )
}