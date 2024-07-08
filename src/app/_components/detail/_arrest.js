import styles from "../../../styles/detail/_arrest.module.css"

import { useState } from "react";

export default function Arrest({title, content, point, img, onClose}) {

    return (
        <div className={styles.arrest_container}>
            <div className={styles.arrest_modal_title}>
                {title}
            </div>
            <img className={styles.arrest_img} src={img} alt="evidence"/>
            <div className={styles.arrest_point }>
                {`총 획득 포인트: ${point}점`}
            </div>
            <div className={styles.arrest_content}>
                {content}
            </div>
            <div className={styles.arrest_button} onClick={onClose}>
                닫기
            </div>
        </div>
    )
}