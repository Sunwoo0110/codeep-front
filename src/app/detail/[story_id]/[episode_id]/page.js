"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from 'next/navigation';

import styles from "@/styles/detail/Detail.module.css"
import Header from "@/app/_components/common/_header";
import Detailbox from "@/app/_components/detail/_detailbox";
import Selection from "@/app/_components/detail/_selection";
import Titlebox from "@/app/_components/detail/_titlebox";
import Evidence from "@/app/_components/detail/_evidence";

export default function Detail() {

    const pathname = usePathname();
    const storyId = pathname.split("/")[2];
    const episodeId = pathname.split("/")[3];

    const detailBoxRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const [detailId, setDetailId] = useState(1);
    const [detailList, setDetailList] = useState([
        {id: 1, text: "111111Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        {id: 2, text: "222222Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        {id: 3, text: "333333Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        {id: 4, text: "444444Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
    ]); // 계속 추가

    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisode, setCurrentEpisode] = useState(-1);
    const [currentEpisodeTitle, setCurrentEpisodeTitle] = useState("");
    const [title, setTitle] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [evidenceId, setEvidenceId] = useState(1);
    const [isSelection, setIsSelection] = useState(false);
    const [isLastEpisode, setIsLastEpisode] = useState(false);
    const [isLastDetail, setIsLastDetail] = useState(false);

    const handleSelectionClick = (selection) => {
        setEvidenceId(selection.evidence);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEvidenceId(0);
    };

    const goNextDetail = () => {

    }

    const goNextEpsiode = () => {

    }

    useEffect(() => {
        const getEpisode = async () => {
            // console.log(storyId);
            // console.log(window.localStorage.getItem("userAge"));
            const res = await axios.post('http://localhost:8000/episodes/get_episodes', {
                story_id: storyId,
                age: window.localStorage.getItem("userAge")
            });
    
            if (res.data.result === "success"){
                // console.log(res.data.episodes);
                await setEpisodeList(res.data.episodes);
                // console.log(episodeList);
                // console.log(episodeId);
                // console.log(res.data.episodes.findIndex(episode => episode._id === episodeId));
                await setCurrentEpisode(res.data.episodes[res.data.episodes.findIndex(episode => episode._id === episodeId)].order);
                await setCurrentEpisodeTitle(res.data.episodes[res.data.episodes.findIndex(episode => episode._id === episodeId)].title);
                if (res.data.episodes[res.data.episodes.findIndex(episode => episode._id === episodeId)].order - 1 === res.data.episodes.length) {
                    await setIsLastEpisode(true);
                }
                await setTitle(`Episode ${res.data.episodes[res.data.episodes.findIndex(episode => episode._id === episodeId)].order}: ${res.data.episodes[res.data.episodes.findIndex(episode => episode._id === episodeId)].title}`);
            } else {
                alert("에피소드 불러오기에 실패하였습니다.")
            }
        }
        getEpisode();
    }, [])

    useEffect(() => {
        console.log(episodeId);
        console.log(window.localStorage.getItem("userId"))
        const getDetail = async () => {
            try {
                const res = await axios.post('http://localhost:8000/details/get_detail', {
                    episode_id: episodeId,
                    user_id: window.localStorage.getItem("userId")
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
    }, [currentEpisode]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = detailBoxRef.current.scrollTop;
            const sectionHeight = detailBoxRef.current.clientHeight;
            const index = Math.round(scrollTop / sectionHeight);
            setActiveIndex(index);
        };
    
        const container = detailBoxRef.current;
        container.addEventListener('scroll', handleScroll);
    
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // if (detailBoxRef.current) {
        //     detailBoxRef.current.scrollTop = detailBoxRef.current.scrollHeight;
        // }

        if (detailBoxRef.current) {
            detailBoxRef.current.scrollTo({
                top: detailBoxRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [detailList]);

    return(
        <div className={styles.container}>
            <Header />
            <Titlebox title={title}/>
            <div className={styles.detail_container}>
                <div className={styles.detail_top} ref={detailBoxRef}>
                    {
                        detailList.map((detail, index) => (
                            <div className={`${styles.detail_box} ${index === activeIndex ? 'active' : ''}`} key={index}>
                                <Detailbox key={index} detailId={detail.id} detailText={detail.text}/>
                            </div>
                        ))
                    }
                </div>
                <div className={styles.detail_bottom}>
                    {isSelection ? (
                        <Selection detailId={detailList[activeIndex].id} onSelect={handleSelectionClick}/>
                    ) : (
                        isLastEpisode ? (
                            <div className={styles.selection_container}>
                                <div className={styles.selection_text} onClick={() => {}}>
                                    Final
                                </div>
                            </div>
                        ) : 
                            ( isLastDetail ? (
                                <div className={styles.selection_container}>
                                    <div className={styles.selection_text} onClick={() => {}}>
                                        Next Episode
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.selection_container}>
                                    <div className={styles.selection_text} onClick={() => {}}>
                                        Next
                                    </div>
                                </div>
                            ))
                        )
                    }  
                </div>
            </div>
            {isModalOpen && (
                <Evidence evidenceId={evidenceId} onClose={handleCloseModal}/>
            )}
        </div>
    )

}