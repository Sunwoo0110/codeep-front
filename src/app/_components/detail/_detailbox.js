"use client";

import styles from "../../../styles/detail/_detailbox.module.css"
import { usePathname, useRouter } from 'next/navigation';
import { useState } from "react";

export default function Detailbox({detailId, detailText}) {

    // const [detailText, setDetailText] = useState("Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse.")

    return (
        <div className={styles.detailbox_container}>
            <div className={styles.detailbox_text}>
                {detailText}
            </div>
        </div>
    )
}