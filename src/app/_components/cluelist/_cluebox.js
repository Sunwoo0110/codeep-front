"use client";

import styles from "@/styles/cluelist/_cluebox.module.css"
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, forwardRef } from "react";

const Cluebox  = (({name, description, point, img}) => {

    // const [detailText, setDetailText] = useState("Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse.")

    return (
        <div className={styles.cluebox_container}>
            <img src={img} className={styles.cluebox_img} />
            <div className={styles.cluebox_right}>
                <div className={styles.cluebox_name}>
                    {name}
                </div>
                <div className={styles.cluebox_point}>
                    {`Point: ${point}`}
                </div>
                <div className={styles.cluebox_description}>
                    {description}
                </div>
            </div>
        </div>
    )
});

export default Cluebox;