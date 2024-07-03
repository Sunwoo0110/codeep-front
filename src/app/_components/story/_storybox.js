"use client";

import styles from "../../../styles/story/_storybox.module.css"
import { usePathname, useRouter } from 'next/navigation';

export default function Storybox({title, sub_title, img, description, id}) {

    const router = useRouter();

    const handleClick = () => {
        router.push({
        pathname: '/detail/' + id,
        query: { title, sub_title, img, description }
        });
    };

    return (
        <div className={styles.storybox_container} onClick={handleClick}>
            <div className={styles.storybox_top}>
                <img src={img} className={styles.storybox_img} />
                <div className={styles.storybox_right}>
                    <div className={styles.storybox_title}>
                        {title}
                    </div>
                    <div className={styles.storybox_subtitle}>
                        {sub_title}
                    </div>
                </div>
            </div>
            <div className={styles.storybox_bottom}>
                <div className={styles.storybox_description}>
                    {description}
                </div>
            </div>
        </div>
    )
}