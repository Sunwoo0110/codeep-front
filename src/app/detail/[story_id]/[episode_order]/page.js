"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from 'next/navigation';

import styles from "@/styles/detail/Detail.module.css"
import Header from "@/app/_components/common/_header";
import Detailbox from "@/app/_components/detail/_detailbox";
// import Selection from "@/app/_components/detail/_selection";
import Titlebox from "@/app/_components/detail/_titlebox";
import Episodebox from "@/app/_components/detail/_episodebox";
// import Evidence from "@/app/_components/detail/_evidence";

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

    const [isLastEpisode, setIsLastEpisode] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const containerRef = useRef(null);

    const goNextDetail = () => {
        console.log(currentDetailIndex);
        if (currentDetailIndex < detailList.length+1) {
            setCurrentDetailIndex(currentDetailIndex + 1);

            if (detailBoxRef.current[currentDetailIndex]) {
                detailBoxRef.current[currentDetailIndex].scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

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
            const res = await axios.post('http://localhost:8000/episodes/episode_order', {
                story_id: storyId,
                level: window.localStorage.getItem("userLevel"),
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
    }, [])

    useEffect(() => {
        // console.log(episodeId);
        // console.log(window.localStorage.getItem("userId"))
        const getDetail = async () => {
            try {
                const res = await axios.post('http://localhost:8000/details/get_all_detail', {
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
                        // currentDetailIndex < detailList.length && (
                        //     <button onClick={goNextDetail} style={{ padding: '10px 20px', marginTop: '20px' }}>Next</button>
                        // )
                    }
                </div>
                {/* <div className={styles.detail_bottom}> */}
                    {/* {isSelection ? (
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
                    }   */}
                {/* </div> */}
            </div>
            {/* {isModalOpen && (
                <Evidence evidenceId={evidenceId} onClose={handleCloseModal}/>
            )} */}
        </div>
    )

}