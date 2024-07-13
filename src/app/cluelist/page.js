"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from 'next/navigation';

import styles from "@/styles/cluelist/ClueList.module.css";
import Header from "@/app/_components/common/_header";
import Cluebox from "@/app/_components/cluelist/_cluebox";
import Titlebox from "@/app/_components/cluelist/_titlebox";

export default function ClueList() {

    const [title, setTitle] = useState("수집된 단서 목록");
    const [cluePoint, setCluePoint] = useState(0);

    const storyId = window.localStorage.getItem("storyId");
    const storyTitle = window.localStorage.getItem("storyTitle");
    const level = parseInt(window.localStorage.getItem("userLevel"));
    const userName = window.localStorage.getItem("userName");

    const [clueList, setClueList] = useState([]);

    useEffect(() => {

        const getClueList = async () => {
            // console.log(storyId);
            // console.log(userName);
            // console.log(level);
            const res = await axios.post(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/clues/get_user_clues`, {
                story_id: storyId,
                name: userName,
                level: level
            });

            if (res.data.result === "success") {
                const new_clues = res.data.clue_list.map((clue) => {
                    return {
                        ...clue.clue,
                        point: clue.point
                    }
                });
                setClueList(new_clues);
            }

            else {
                alert("단서 불러오기에 실패하였습니다.")
            }
        }

        const getCluePoint = async () => {
            const res = await axios.post(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/all_clue_point`, {
                story_id: storyId,
                name: userName,
                level: level
            });

            if (res.data.result === "success") {
                setCluePoint(res.data.point);
            }
        }

        getClueList();
        getCluePoint();
    }, [])

    return(
        <div className={styles.container}>
            <Header />
            <Titlebox title={title} storyTitle={storyTitle} cluePoint={cluePoint}/>
            <div className={styles.cluelist_container}>
                <div className={styles.cluelist_top}>
                    {
                        clueList.map((clue, index) => (
                            <Cluebox key={index} 
                            name={clue.name}
                            description={clue.description}
                            point={clue.point}
                            img={clue.img}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}