"use client";

import styles from "../../styles/main/Main.module.css"
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../_components/common/_header";

export default function Main() {

    const [maintitle, setMainTitle] = useState('알씨: Read Clue');
    const [subtitle, setSubTitle] = useState('스토리 기반 영어 학습용 \n생성형 추리 게임');
    const [description, setDescription] = useState('추리 사건 속의\n단서를 수집하고\n범인을 검거 해보세요!🕵🏻‍♂️');
    const [startButton, setStartButton] = useState('추리 시작하기');
    
    const start = async () => {   
        window.location.href = "/story"
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.main_container}>
                <div className={styles.main_title}>
                    {maintitle}
                </div>
                <div className={styles.sub_title}>
                    {subtitle}
                </div>
                <div className={styles.description}>
                    {description}
                </div>
                <div className={styles.start_button} onClick={start}>
                    {startButton}
                </div>
            </div>
        </div>
    )
}