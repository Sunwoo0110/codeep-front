"use client";

import styles from "../../styles/main/Main.module.css"
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../_components/common/_header";

export default function Main() {

    const [maintitle, setMainTitle] = useState('\n알씨\nRead Clue');
    const [subtitle, setSubTitle] = useState('GPT 기반 추리형 영어 독해 학습 서비스');
    const [startButton, setStartButton] = useState('추리 시작하기');
    
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);  
    const [userId, setUserId] = useState(0);

    const start = async () => {   

        console.log(name);
        console.log(parseInt(age));

        console.log(typeof(name));
        console.log(typeof(parseInt(age)));

        const res = await axios.post("http://127.0.0.1:8000/users/register", {
                name: name,
                age: parseInt(age, 10), 
            }
        )

        if (res.data.result === "success"){
            setUserId(res.data.user._id);
            window.localStorage.removeItem("userName");
            window.localStorage.removeItem("userId");
            window.localStorage.removeItem("userAge");
            window.localStorage.setItem("userName", name);
            window.localStorage.setItem("userId", userId);
            window.localStorage.setItem("userAge", age);

            // console.log(window.localStorage.getItem("userName"));
            // console.log(window.localStorage.getItem("userId"));
            window.location.href = "/story"
        } else {
            alert("로그인에 실패하였습니다.")
        }
    }

    useEffect(() => {
        window.localStorage.setItem("userName", name);
        window.localStorage.setItem("userId", userId);

        console.log(window.localStorage.getItem("userName"));
        console.log(window.localStorage.getItem("userId"));
    }, [userId])

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
                <input className={styles.main_input} placeholder="이름을 입력하세요"
                onChange={(e) => setName(e.target.value)}/>
                <input className={styles.main_input} placeholder="나이를 입력하세요" type="number"
                onChange={(e) => setAge(e.target.value)}/>
                <div className={styles.start_button} onClick={start}>
                    {startButton}
                </div>
            </div>
        </div>
    )
}