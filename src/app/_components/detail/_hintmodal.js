import styles from "../../../styles/detail/_hintmodal.module.css"

import { useState } from "react";

export default function Hintmodal({title, text, onClick}) {
    return (
        <div className={styles.hintmodal_container}>
            <div className={styles.hintmodal_title}>
                힌트 확인
            </div>
            <div className={styles.hintmodal_subtitle}>
                {title}
            </div>
            <div className={styles.hintmodal_text}>
                {text}
            </div>
            <div className={styles.hintmodal_button} onClick={onClick}>
                닫기
            </div>
        </div>
    )
}