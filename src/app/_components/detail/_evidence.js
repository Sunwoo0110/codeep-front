import styles from "../../../styles/detail/_evidence.module.css"

import { useState } from "react";

export default function Evidence({evidenceId, onClose}) {

    console.log(evidenceId);

    const [title, setTitle] = useState("증거1111111");
    const [text, setText] = useState("증거 설명~~~");
    const [img, setImg] = useState("/images/conan.png");

    return (
        <div className={styles.evidence_container}>
            <div className={styles.evidence_modal_title}>
                증거 수집 성공!
            </div>
            <div className={styles.evidence_title}>
                {title}
            </div>
                <img className={styles.evidence_img} src={img} alt="evidence"/>
            <div className={styles.evidence_text}>
                {text}
            </div>
            <div className={styles.evidence_close} onClick={onClose}>
                닫기
            </div>
        </div>
    )
}