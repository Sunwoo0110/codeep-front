"use client;"

import styles from "../../../styles/detail/_rightchat.module.css"

export default function Rightchat({name, content, point}) {
    return (
        <div className={styles.chatroom_right_container}>
            <div className={styles.chatroom_right_name}>{name}</div>
            <div className={styles.chatroom_right_content}>{content}</div>
            <div className={styles.chatroom_right_point}>{`Point: ${point}`}</div>
        </div>
    )
}