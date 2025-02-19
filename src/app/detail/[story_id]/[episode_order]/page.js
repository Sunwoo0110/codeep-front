"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from 'next/navigation';

import styles from "@/styles/detail/Detail.module.css"
import Header from "@/app/_components/common/_header";
import Detailbox from "@/app/_components/detail/_detailbox";
import Scoreheader from "@/app/_components/common/_scoreheader";
// import Selection from "@/app/_components/detail/_selection";
import Titlebox from "@/app/_components/detail/_titlebox";
import Episodebox from "@/app/_components/detail/_episodebox";


export default function Detail() {

    const router = useRouter();

    const pathname = usePathname();
    const storyId = pathname.split("/")[2];
    const episodeOrder = pathname.split("/")[3];

    const detailBoxRef = useRef([]);
    const [currentDetailIndex, setCurrentDetailIndex] = useState(1);

    const [detailId, setDetailId] = useState(1);
    const [detailList, setDetailList] = useState([
        // {id: 1, text: "111111Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        // {id: 2, text: "222222Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        // {id: 3, text: "333333Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        // {id: 4, text: "444444Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
    ]); // 계속 추가

    const [episodeId, setEpisodeId] = useState(1);
    const [episodeInfo, setEpisodeInfo] = useState({});
    const [clueNum, setClueNum] = useState(0);
    const [title, setTitle] = useState("");

    const [cluePoint, setCluePoint] = useState(0); 
    const [detectPoint, setDetectPoint] = useState(0);

    const [isLastEpisode, setIsLastEpisode] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const level = parseInt(window.localStorage.getItem("userLevel"));
    const userName = window.localStorage.getItem("userName");

    const containerRef = useRef(null);

    const goNextEpsiode = () => {

        if (clueNum === 0) {
            if (parseInt(episodeOrder) === parseInt(episodeInfo.num_of_episodes) - 1) {
                window.location.href = `/detail/${storyId}/${parseInt(episodeOrder)}/reasoning`;
            } else {
                window.location.href = `/detail/${storyId}/${parseInt(episodeOrder)+1}`;
            } 
        } else {
            window.location.href = `/detail/${storyId}/${episodeOrder}/clue`;
        }
    }

    const goFinal = () => {
        window.location.href = `/detail/${storyId}/final`;
    }

    const getPoint = async () => {
        const clue_res = await axios.post(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/all_clue_point`, {
            story_id: storyId,
            name: userName,
            level: level,
        })
        if (clue_res.data.result === "success") {
            setCluePoint(clue_res.data.point);
        }

        const detect_res = await axios.post(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/all_detect_point`, {
            story_id: storyId,
            name: userName,
            level: level,
        })
        if (detect_res.data.result === "success") {
            setDetectPoint(detect_res.data.total_point);
        }
    }

    
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
                setIsAtBottom(scrollTop + clientHeight + (scrollHeight / (2*(detailList.length+1))) >= scrollHeight);
            }
        };
    
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [detailList]);


    useEffect(() => {
        detailBoxRef.current = detailBoxRef.current.slice(0, detailList.length);
    }, [detailList.length]);

    useEffect(() => {
        const getEpisode = async () => {
            const res = await axios.post('http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/episodes/episode_order', {
                story_id: storyId,
                level: parseInt(window.localStorage.getItem("userLevel")),
                order: episodeOrder
            });
    
            if (res.data.result === "success"){
                await setTitle(res.data.episodes.title);
                await setEpisodeId(res.data.episodes._id);
                await setEpisodeInfo(res.data.episodes);
                await setClueNum(res.data.episodes.num_of_clues);
            } else {
                alert("에피소드 불러오기에 실패하였습니다.")
            }
        }
        getEpisode();
        getPoint();
    }, [])

    useEffect(() => {
        // console.log(episodeId);
        // console.log(window.localStorage.getItem("userId"))
        const getDetail = async () => {
            try {
                const res = await axios.post('http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/details/get_all_detail', {
                    episode_id: episodeId,
                });
        
                if (res.data.result === "success"){
                    // console.log(res.data.details);
                    console.log(res.data);
                    await setDetailList(res.data.details);
                    // console.log(detailList);
                } else {
                    // alert("디테일 불러오기에 실패하였습니다.")
                }
            } catch (error) {
                setDetailList([])
            }
        }
        getDetail();

        if (parseInt(episodeOrder) === parseInt(episodeInfo.num_of_episodes)) {
            console.log("last episode");
            setIsLastEpisode(true);
            
        }
    }, [episodeId]);

    return(
        <div className={styles.container}>
            <Header />
            <Scoreheader cluePoint={cluePoint} detectPoint={detectPoint}/>
            <Titlebox title={`Episode ${episodeOrder}: ${title}`}/>
            <div className={styles.detail_container}>
                <div className={styles.detail_top} ref={containerRef}>
                    <div className={styles.detail_episodebox}>
                        <Episodebox title={title} description={episodeInfo.description} order={episodeOrder} img={episodeInfo.img}/>    
                    </div>
                    {
                        detailList.map((detail, index) => (
                            <>
                            <div className={styles.detail_box} key={index}>
                                <Detailbox key={index} detailText={detail.content} 
                                ref={el => (detailBoxRef.current[index] = el)}/>
                            </div>
                            <div className={styles.detail_order_text}>
                                {index+1}
                            </div>
                            </>
                        ))
                    }
                </div>
                <div className={styles.detail_bottom}>
                    {
                        (!isLastEpisode && isAtBottom) && (
                            <div className={styles.selection_container}>
                                <div className={styles.selection_text} onClick={goNextEpsiode}>
                                    Next Episode
                                </div>
                            </div>
                        )
                    }
                    {
                        (isLastEpisode && isAtBottom ) && (
                            <div className={styles.selection_container}>
                                <div className={styles.selection_text} onClick={goFinal}>
                                    결과 확인하기
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )

}