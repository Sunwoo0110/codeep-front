"use client";

import styles from "../../styles/story/Story.module.css"
import axios from "axios";
import { useState, useEffect } from "react";

import Header from "../_components/common/_header";
import Storybox from "../_components/story/_storybox";

export default function Story() {

    const [maintitle, setMainTitle] = useState('원하는 추리 소설을 선택하세요!');
    
    const [title, setTitle] = useState("명탐정 코난");
    const [sub_title, setSubTitle] = useState("살의는 커피의 향기");
    const [description, setDescription] = useState("testtesttesttesttesttesttesttest\ntestsetest\ntestestsetes");
    const [img, setImg] = useState("/images/conan.png");
    const [id, setId] = useState(1);

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
            <div className={styles.story_container}>
                <div className={styles.story_title}>
                    {maintitle}
                </div>
                <div className={styles.story_list}>
                    <Storybox title={title} sub_title={sub_title} img={img} description={description} id={id}/>
                    <Storybox title={title} sub_title={sub_title} img={img} description={description} id={id}/>
                </div>
            </div>
        </div>
    )
}