"use client";

import styles from "../../styles/main/Main.module.css"
import axios from "axios";
import { useState, useEffect } from "react";
import Header from "../_components/common/_header";

export default function Main() {

    const [maintitle, setMainTitle] = useState('\n제목');
    const [subtitle, setSubTitle] = useState('부연 설명');
    const [startButton, setStartButton] = useState('추리 시작하기');
    
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);  

    const start = async () => {   
        // console.log(name + " " + password);
        // console.log(password);
        // const res = await axios.post("http://localhost:3000/api/login", {
        //     body: {
        //         name: name,
        //         password: password
        //     }
        // })

        // if (res.data.message === "success"){
        //     window.localStorage.removeItem("userName");
        //     window.localStorage.removeItem("userId");
        //     window.localStorage.setItem("userName", name);
        //     window.localStorage.setItem("userId", res.data.data);

        //     console.log(window.localStorage.getItem("userName"));
        //     console.log(window.localStorage.getItem("userId"));
        //     window.location.href = "/friends"
        // } else {
        //     alert("로그인에 실패하였습니다.")
        // }
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