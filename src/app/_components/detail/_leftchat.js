"use client;"

import styles from "../../../styles/detail/_leftchat.module.css"

export default function Leftchat({name, content}) {
    // console.log(name)

    const mapping = {
        "밤": "bam",
        "블로섬": "blossom",
        "엘사": "elsa",
        "루피": "luffy",
        "나루토": "naruto",
        "백설공주": "snowwhite", 
    }

    return (
        <div className={styles.chatroom_left_container}>
            <img src={"/images/conan/conan.png"} className={styles.chatroom_left_image} />
            <div className={styles.chatroom_left_line}>
                <div className={styles.chatroom_left_name}>{name}</div>
                <div className={styles.chatroom_left_content}>{content}</div>
            </div>
        </div>
    )
}