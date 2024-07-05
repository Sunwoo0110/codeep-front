"use client";

import styles from "../../../styles/common/_header.module.css"
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    return (
        <div className={styles.header_container} >
            <button style={{ backgroundColor: "inherit", border: "none" }} onClick={() => router.back()}>
                <img src="/images/back.png" alt="back" className={styles.image_button} />
            </button>

            <button style={{ backgroundColor: "inherit", border: "none" }} onClick={() => window.history.forward()}>
                <img src="/images/forward.png" alt="forward" className={styles.image_button} />
            </button>
            {/* <button style={{ backgroundColor: "inherit", border: "none" }} >
                <img src="/images/friends.png" alt="friends" className={styles.image_button}
                    onClick={() => { router.push("/friends");}} />
            </button>
            <button style={{ backgroundColor: "inherit", border: "none" }} >
                <img src="/images/chat.png" alt="chat" className={styles.image_button}
                    onClick={() => { router.push("/chats")}} />
            </button> */}
        </div>
    )
}