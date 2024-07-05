"use client";

import styles from "../../../styles/detail/_episodebox.module.css"
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, forwardRef } from "react";

const Episodebox  = forwardRef(({title, description, order, img}, ref) => {

    // const [detailText, setDetailText] = useState("Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse.")

    return (
        <div className={styles.episodebox_container} ref={ref}>
            <div className={styles.episodebox_title}>
                {title}
            </div>
            <img src={img} className={styles.episodebox_img} />
            <div className={styles.episodebox_text}>
                {description}
            </div>
        </div>
    )
});

export default Episodebox;