"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Header from "../../../../_components/common/_header";
import styles from "../../../../../styles/detail/Clue.module.css";

export default function Clue() {

    const [maintitle, setMainTitle] = useState('에피소드에서 단서들을 발견해보세요!');
    const [subtitle, setSubTitle] = useState('');
    const [hintTitle, setHintTitle] = useState('');
    const [clueButton, setClueButton] = useState('단서 확인하기');
    const [nextButton, setNextButton] = useState('다음 에피소드로 이동하기');
    const [isLastClue, setIsLastClue] = useState(false);
    
    const [episodeId, setEpisodeId] = useState(1);
    const [episodeInfo, setEpisodeInfo] = useState({});
    const [title, setTitle] = useState("");

    const [detailId, setDetailId] = useState(1);
    const [detailList, setDetailList] = useState([
        // {id: 1, text: "111111Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        // {id: 2, text: "222222Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        // {id: 3, text: "333333Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        // {id: 4, text: "444444Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
    ]); // 계속 추가

    const [clueNum, setClueNum] = useState(10);
    const [clueInput, setClueInput] = useState('');
    const [currentClueNum, setCurrentClueNum] = useState(1);
    const [clueTry, setClueTry] = useState(1);
    const [collectedClueList, setCollectedClueList] = useState([])

    const pathname = usePathname();
    const storyId = pathname.split("/")[2];
    const episodeOrder = pathname.split("/")[3];

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
                await setSubTitle(`이번 에피소드에서 단서는 총 ${res.data.episodes.num_of_clues}개 존재했습니다.\n단서 입력은 에피소드에 등장한 순서대로 입력해주세요.\n에피소드에 나타난 단어로 정확히 입력해주세요.\n단서 당 총 3번의 기회가 주어집니다.`);
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
                    await setCollectedClueList
                    // console.log(detailList);
                } else {
                    // alert("디테일 불러오기에 실패하였습니다.")
                }
            } catch (error) {
                setDetailList([])
            }
        }
        getDetail();
    }, [episodeId]);

    const clueClick = async () => {
        // console.log(episodeId);
        const res = await axios.post('http://localhost:8000/clues/check_clue', {
            episode_id: episodeId,
            name: clueInput,
            num_of_try: clueTry,
            order: currentClueNum
        });

        if (res.data.result === "success"){
            setCollectedClueList([...collectedClueList, res.data.clue]);
            setCurrentClueNum(currentClueNum + 1);
            // 한번에 성공
            if (currentClueNum === clueNum) {
                setHintTitle("축하합니다! 모든 단서를 찾으셨습니다.\n 다음 에피소드로 이동합니다.");
                // window.location.href = `/detail/${storyId}/${episodeOrder+1}`;
            }
            // 다음 단서
            else {
                // 단서 리스트에 추가
                setClueTry(1);
            }
        }
        else if (res.data.result === "wrong") {
            if (clueTry === 1) {
                const index = detailList.findIndex(item => item._id === res.data.clue.detail_id);
                setHintTitle(`올바르지 않은 단서입니다. 다시 입력해주세요.\n(힌트: ${index+1}번째 단락)`);
                setClueTry(2);
            } else if (clueTry === 2) {
                const index = detailList.findIndex(item => item._id === res.data.clue.detail_id);
                setHintTitle(`단서 발견에 실패하셨습니다.\n정답: ${res.data.clue.name}\n`);
                setCurrentClueNum(currentClueNum + 1);
                setClueTry(1);
                setCollectedClueList([...collectedClueList, res.data.clue]);
            }
        }

        setClueInput('')
    }

    const nextClick = () => {
        console.log(episodeOrder);
        console.log(episodeInfo.num_of_episodes);
        if (parseInt(episodeOrder) === parseInt(episodeInfo.num_of_episodes) - 1) {
            window.location.href = `/detail/${storyId}/${parseInt(episodeOrder)}/reasoning`;
        } else {
            window.location.href = `/detail/${storyId}/${parseInt(episodeOrder)+1}`;
        } 
    }

    useEffect(() => {
        
        if (currentClueNum > clueNum) {
            setIsLastClue(true);
            setSubTitle('모든 증거 수집이 완료되었습니다.');
        }

    }, [collectedClueList, currentClueNum])

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.clue_container}>
                <div className={styles.main_title}>
                    {maintitle}
                </div>
                {
                    isLastClue ? (
                        <div className={styles.clue_button} onClick={nextClick}>
                            {nextButton}
                        </div>
                    ) : null
                }
                <div className={styles.sub_title}>
                    {subtitle}
                </div>
                <div className={styles.hint_title}>
                    {hintTitle}
                </div>
                <input className={styles.clue_input} placeholder="단서를 입력하세요" value={clueInput}
                onChange={(e) => {
                    setClueInput(e.target.value)
                }}/>
                <div className={styles.clue_button} onClick={clueClick}>
                    {clueButton}
                </div>

                <div className={styles.clue_bottom}>
                    <div className={styles.collected_clue_title}>
                        단서 목록
                    </div>
                    <div className={styles.collected_clue_container}>
                        {collectedClueList.map((clue, index) => (
                            <div key={index} className={styles.collected_clue_box}>
                                <img src="/images/conan/story.png" className={styles.collected_clue_img} />
                                <div className={styles.collected_clue_text}>{clue.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}