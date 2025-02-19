"use client";

import { useState, useEffect } from "react";
import styles from "../../../../styles/detail/Final.module.css"
import Header from "../../../_components/common/_header";
import Storybox from "@/app/_components/story/_storybox";
import { usePathname, useRouter } from 'next/navigation';
import axios from "axios";

export default function Final() {

    const pathname = usePathname();
    const storyId = pathname.split("/")[2];

    const level = parseInt(window.localStorage.getItem("userLevel"));
    const userName = window.localStorage.getItem("userName");
    const storyTitle = window.localStorage.getItem("storyTitle");
    const isArrest =( window.localStorage.getItem("isArrest") === "true") ? true : false;

    const [totalCluePoint, setTotalCluePoint] = useState(0);
    const [totalDetectPoint, setTotalDetectPoint] = useState(0);
    const [totalDetectTime, setTotalDetectTime] = useState("00:00");
    const [arrestNum, setArrestNum] = useState(0);
    const [completeNum, setCompleteNum] = useState(0);

    const [storyCluePoint, setStoryCluePoint] = useState(0);
    const [storyDetectPoint, setStoryDetectPoint] = useState(0);
    const [storyRanking, setStoryRanking] = useState([]);
    const [totalRanking, setTotalRanking] = useState([])
    const [storyRank, setStoryRank] = useState(0);
    const [totalRank, setTotalRank] = useState(0);

    const [homeButton, setHomeButton] = useState('처음으로');
    const [storyList, setStoryList] = useState([]);

    const [nextStory, setNextStory] = useState({}); 

    const goHome = () => {
        window.location.href = `/story`;
    }

    const startStats = async () => {
        const res = await axios.post("http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/stats/ep1_start", {
            name: userName,
        })
        if (res.data.result === "success"){
            // window.localStorage.removeItem("userId");
            // window.localStorage.setItem("userId", res.data.user._id);
        } else {
            alert("시작 스탯 생성에 실패하였습니다.")
        }
    }

    const handleStoryboxClick = async (storyId, storyTitle) => {
        
        await startStats();

        window.localStorage.removeItem("storyId");
        window.localStorage.setItem("storyId", storyId);
        window.localStorage.removeItem("storyTitle");
        window.localStorage.setItem("storyTitle", storyTitle);
        
        window.location.href = `/detail/${storyId}/1`
    }

    const getRanking = async () => {
        const story_res = await axios.post(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/ranks/story_rank`, {
            story_id: storyId,
            name: userName,
            level: level
        })

        if (story_res.data.result === "success") {
            setStoryRanking(story_res.data.rank.rank_list);
            setStoryRank(story_res.data.rank.target.rank);
        } else {
            alert("랭킹 불러오기에 실패하였습니다.")
        }

        const total_res = await axios.get(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/ranks/total_rank/${userName}`)
        if (total_res.data.result === "success") {
            setTotalRanking(total_res.data.rank.rank_list);
            setTotalRank(total_res.data.rank.target.rank);
        } else {
            alert("랭킹 불러오기에 실패하였습니다.")
        }
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    const clickTest = () => {
        window.location.href = 'https://forms.gle/Uj7bbQi2FnVjCdZu9';
    }

    useEffect(() => {
        const getStory = async () => {   
            const res = await axios.get(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/stories/info/${window.localStorage.getItem("userAge")}`)
    
            if (res.data.result === "success"){
                console.log(res.data.stories);
                await setStoryList(res.data.stories);
                // console.log(res.data.stories.find(story => story._id !== storyId))

                setNextStory(res.data.stories.find(story => story._id !== storyId));
            } else {
                alert("스토리 불러오기에 실패하였습니다.")
            }
        }
        getStory();
    }, [])

    useEffect(() => {

        const getStats = async () => {
            const res = await axios.get(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/stats/get_stat/${userName}`)

            if (res.data.result === "success") {
                setTotalCluePoint(res.data.stat.clue_point);
                setTotalDetectPoint(res.data.stat.detect_point);
                setTotalDetectTime(res.data.stat.detect_time);
                setArrestNum(res.data.stat.num_of_arrest);
                setCompleteNum(res.data.stat.num_of_complete);
            } else {
                alert("스탯 불러오기에 실패하였습니다.")
            }
        }

        const getStoryCluePoint = async () => {
            const res = await axios.post(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/all_clue_point`, {
                story_id: storyId,
                name: userName,
                level: level
            })

            if (res.data.result === "success") {
                setStoryCluePoint(res.data.point);
            } else {
                alert("스토리 단서 점수 불러오기에 실패하였습니다.")
            }
        }

        const getStoryDetectPoint = async () => {
            const res = await axios.post(`http://ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/all_detect_point`, {
                story_id: storyId,
                name: userName,
                level: level
            })

            if (res.data.result === "success") {
                setStoryDetectPoint(res.data.total_point);
            } else {
                alert("스토리 추리 점수 불러오기에 실패하였습니다.")
            }
        }

        getStats();
        getStoryCluePoint();
        getStoryDetectPoint();
        getRanking();
    }, [])


    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.final_container}>
                <div className={styles.final_title}>Final Result</div>
                <div className={styles.final_test_button}
                onClick={clickTest}>설문 조사 참여하고 상품 받기</div>
                <div className={styles.final_result_container}>
                    <div className={styles.final_top}>
                        <div className={styles.final_subtitle}>
                            스토리 플레이 결과
                        </div>
                        <div className={styles.final_storytitle}>
                            {`${storyTitle} (${(parseInt(level) === 1) ? "초급" : (parseInt(level) === 2) ? "중급" : "고급"})`}
                        </div>
                        <div className={styles.final_arresttitle}>
                            {`${(isArrest === true) ? "범인 검거 성공" : "범인 검거 실패"}`}
                        </div>
                        <div className={styles.final_rank}>
                            {`스토리 순위: ${storyRank}위`}
                        </div>
                        <div className={styles.final_text}>
                            {`단서 포인트: ${storyCluePoint}점\n`}
                            {`추리 포인트: ${storyDetectPoint}점\n`}
                            {`플레이 시간: ${totalDetectTime.split(":")[0]}분 ${totalDetectTime.split(":")[1]}초\n`}
                        </div>
                    </div>

                    <div className={styles.final_top}>
                        <div className={styles.final_subtitle}>
                            총 플레이 결과
                        </div>
                        <div className={styles.final_arresttitle}>
                            {`범인 검거율: ${(completeNum === 0) ? 0 : ((arrestNum / completeNum) * 100).toFixed(2)}%`}
                        </div>
                        <div className={styles.final_rank}>
                            {`전체 순위: ${totalRank}위`}
                        </div>
                        <div className={styles.final_text}>
                            {`전체 단서 포인트: ${totalCluePoint}점\n`}
                            {`전체 추리 포인트: ${totalDetectPoint}점\n\n`}
                            {`검거 성공 횟수: ${arrestNum}번\n`}
                            {`스토리 클리어 횟수: ${completeNum}번\n`}
                        </div>
                    </div>
                </div>

                <div className={styles.final_top}>
                    <div className={styles.final_subtitle}>
                        스토리 플레이 순위
                    </div>
                    <div className={styles.final_storytitle}>
                        {`${storyTitle}`}
                    </div>
                    <div className={styles.final_ranking_container}>
                        {storyRanking.map((rank, index) => {
                            return (
                                <div key={index} className={styles.final_ranking_box}>
                                    <div className={styles.final_ranking_top}>
                                        <div className={styles.final_ranking_rank}>{`${index+1}위 ${rank.name}`}</div>
                                        {/* <div className={styles.final_ranking_name}>{rank.name}</div> */}
                                    </div>
                                    <div className={styles.final_ranking_bottom}>
                                        <div className={styles.final_ranking_point}>{rank.story_point}점</div>
                                        <div className={styles.final_ranking_time}>{formatDate(rank.created_at)}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className={styles.final_top}>
                    <div className={styles.final_subtitle}>
                        전체 플레이 순위
                    </div>
                    <div className={styles.final_ranking_container}>
                        {
                            totalRanking.map((rank, index) => {
                                return (
                                    <div key={index} className={styles.final_ranking_box}>
                                        <div className={styles.final_ranking_top}>
                                            <div className={styles.final_ranking_rank}>{`${index+1}위 ${rank.name}`}</div>
                                            {/* <div className={styles.final_ranking_name}>{rank.name}</div> */}
                                        </div>
                                        <div className={styles.final_ranking_bottom}>
                                            <div className={styles.final_ranking_point}>{rank.total_story_point}점</div>
                                            {/* <div className={styles.final_ranking_time}>{formatDate(rank.created_at)}</div> */}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className={styles.final_subtitle}>
                    추천 스토리
                </div>
                <Storybox title={nextStory.title}
                sub_title={nextStory.sub_title}
                img={nextStory.img}
                description={nextStory.description}
                onClick={() => handleStoryboxClick(nextStory._id, nextStory.title)} />

                <div className={styles.home_button} onClick={goHome}>
                    {homeButton}
                </div>
            </div>
        </div>
    )
}