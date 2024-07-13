"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Header from "../../../../_components/common/_header";
import Scoreheader from "@/app/_components/common/_scoreheader";
import Cluebox from "@/app/_components/cluelist/_cluebox";
import Hintmodal from "@/app/_components/detail/_hintmodal"
import styles from "../../../../../styles/detail/Clue.module.css";

export default function Clue() {

    const [maintitle, setMainTitle] = useState('에피소드에서 단서들을 발견해보세요!');
    const [subtitle, setSubTitle] = useState('');
    const [hintTitle, setHintTitle] = useState(window.localStorage.getItem("hintTitle") ? window.localStorage.getItem("hintTitle") : '');
    const [orderTitle, setOrderTitle] = useState('');
    const [ruleTitle, setRuleTitle] = useState('단서 당 기본 점수: 3점 | 힌트 사용 시: 1점 | 단서 확인 시: 0점');

    const [clueButton, setClueButton] = useState('정답 확인하기');
    const [nextButton, setNextButton] = useState('다음 에피소드로 이동하기');
    const [hintButton, setHintButton] = useState('힌트 보기');

    const [isLastClue, setIsLastClue] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isHint, setIsHint] = useState(window.localStorage.getItem("isHint") === "true" ? true : false);
    const [isClue, setIsClue] = useState(false);
    
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
    const [currentClueNum, setCurrentClueNum] = useState(window.localStorage.getItem("currentClueNum") ? parseInt(window.localStorage.getItem("currentClueNum")) : 1);
    const [cluePoint, setCluePoint] = useState(0); 
    const [clueList, setClueList] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detectPoint, setDetectPoint] = useState(0);

    const pathname = usePathname();
    const storyId = pathname.split("/")[2];
    const episodeOrder = pathname.split("/")[3];

    const level = parseInt(window.localStorage.getItem("userLevel"));
    const userName = window.localStorage.getItem("userName");

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            findClick();
        } 
    };

    const getClueList = async () => {
        const res = await axios.post(`ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/clues/get_user_clues`, {
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
            }).reverse();
            await setClueList(new_clues);
        }
        else {
            // alert("단서 불러오기에 실패하였습니다.")
        }
    }

    const addPoint = async (hint) => {
        console.log("hint", hint);
        const res = await axios.post('ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/add_clue_point', {
            story_id: storyId,
            name: userName,
            level: level,
            episode_id: episodeId,
            is_hint: hint,
            clue_order: currentClueNum
        });
        console.log(res.data);
    }

    const getPoint = async () => {
        const clue_res = await axios.post(`ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/all_clue_point`, {
            story_id: storyId,
            name: userName,
            level: level,
        })
        if (clue_res.data.result === "success") {
            setCluePoint(clue_res.data.point);
        }

        const detect_res = await axios.post(`ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/all_detect_point`, {
            story_id: storyId,
            name: userName,
            level: level,
        })
        if (detect_res.data.result === "success") {
            setDetectPoint(detect_res.data.total_point);
        }
    }

    useEffect(() => {

        const getEpisode = async () => {
            const res = await axios.post('ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/episodes/episode_order', {
                story_id: storyId,
                level: parseInt(window.localStorage.getItem("userLevel")),
                order: episodeOrder
            });
    
            if (res.data.result === "success"){
                await setTitle(res.data.episodes.title);
                await setEpisodeId(res.data.episodes._id);
                await setEpisodeInfo(res.data.episodes);
                await setClueNum(res.data.episodes.num_of_clues);
                await setSubTitle(`이번 에피소드에서 단서는 총 ${res.data.episodes.num_of_clues}개 존재했습니다.\n단서 입력은 에피소드에 등장한 순서대로 입력해주세요.\n에피소드에 나타난 단어로 정확히 입력해주세요.\n모든 단서를 수집한 후, 다음 에피소드로 진행 가능합니다.\n수집된 단서들은 최종 범인 추리 시 도움이 됩니다.`);
            } else {
                alert("에피소드 불러오기에 실패하였습니다.")
            }
        }

        const getCluePoint = async () => {
            const res = await axios.post(`ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/points/all_clue_point`, {
                story_id: storyId,
                name: userName,
                level: level
            });

            if (res.data.result === "success") {
                setCluePoint(res.data.point);
            }
        }

        getEpisode();
        getClueList();
        getCluePoint();
        getPoint();
    }, [])

    useEffect(() => {
        const getDetail = async () => {
            try {
                const res = await axios.post('ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/details/get_all_detail', {
                    episode_id: episodeId,
                });
        
                if (res.data.result === "success"){
                    console.log(res.data);
                    await setDetailList(res.data.details);
                } else {
                    // alert("디테일 불러오기에 실패하였습니다.")
                }
            } catch (error) {
                setDetailList([])
            }
        }
        getDetail();
    }, [episodeId]);

    useEffect(() => {
        getClueList();
        window.localStorage.removeItem("currentClueNum");
        window.localStorage.setItem("currentClueNum", currentClueNum);
        if (currentClueNum <= clueNum) {
            setOrderTitle(`${currentClueNum}번째 단서를 입력해주세요.`);
        }
        getPoint();
    }, [currentClueNum])

    const handleCloseModal = () => {
        console.log("close")
        setIsModalOpen(false);
    };
    
    const hintClick = async () => {
        const isConfirmed = confirm("힌트를 사용하시겠습니까?\n힌트 사용 시 1점이 차감됩니다.");
        if(isConfirmed) {
            const res = await axios.post('ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/clues/check_clue', {
                episode_id: episodeId,
                name: clueInput,
                order: currentClueNum
            });

            if (res.data.result === "success"){

            } else if (res.data.result === "wrong") {
                const index = detailList.findIndex(item => item._id === res.data.clue.detail_id);
                setHintTitle(`단서 위치: ${index+1}번째 단락`);
                setIsHint(true);
                // 힌트 모달창
                setIsModalOpen(true)
            }
        }
    }
    

    const clueClick = async () => {
        const isConfirmed = confirm("단서를 확인하시겠습니까?\n단서 확인 시 점수를 획득하지 못합니다.");
        if(isConfirmed) {
            const res = await axios.post('ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/clues/check_clue', {
                episode_id: episodeId,
                name: clueInput,
                order: currentClueNum
            });

            if (res.data.result === "success"){

            } else if (res.data.result === "wrong") {
                const index = detailList.findIndex(item => item._id === res.data.clue.detail_id);
                setHintTitle(`정답: ${res.data.clue.name}\n단서 위치: ${index+1}번째 단락`);
                setIsClue(true);
                // 점수 감점
                // 0이 힌트 안쓴거 1이 힌트 2가 정답확인 한거
                addPoint(2);
                await getClueList();
                
                // TODO: 단서 추가
                if (currentClueNum === clueNum) {
                    setHintTitle("축하합니다! 모든 단서를 찾으셨습니다.\n 다음 에피소드로 이동합니다.");
                }
                // 다음 단서
                else {
                    // 단서 리스트에 추가
                    setHintTitle(`단서를 추가하셨습니다!`);
                }
                setCurrentClueNum(currentClueNum + 1);
                setClueInput('')
                setIsHint(false);
            }
        }
    }

    const findClick = async () => {
        const res = await axios.post('ec2-54-180-131-231.ap-northeast-2.compute.amazonaws.com/clues/check_clue', {
            episode_id: episodeId,
            name: clueInput,
            order: currentClueNum
        });

        if (res.data.result === "success"){
            console.log("hint", isHint)
            if (!isHint && !isClue) {
                console.log("hint", isHint)
                setClueList([...clueList, {
                    name: res.data.clue.name,
                    description: res.data.clue.description,
                    img: res.data.clue.img,
                    point: 3
                }]);
                addPoint(0);
            } else if (isHint) {
                console.log("hint", isHint)
                setClueList([...clueList, {
                    name: res.data.clue.name,
                    description: res.data.clue.description,
                    img: res.data.clue.img,
                    point: 1
                }]);
                addPoint(1);
            }
            setIsHint(false);
            await getClueList();

            if (currentClueNum === clueNum) {
                setHintTitle("축하합니다! 모든 단서를 찾으셨습니다.\n 다음 에피소드로 이동합니다.");
            }
            // 다음 단서
            else {
                // 단서 리스트에 추가
                setHintTitle(`단서 발견에 성공하셨습니다!\n단서를 추가합니다.`);
            }

            setCurrentClueNum(currentClueNum + 1);
        }
        else if (res.data.result === "wrong") {
            setHintTitle(`올바르지 않은 단서입니다. 다시 입력해주세요.\n에피소드에 나타난 단어로 정확히 입력해주세요.`);
        }

        setClueInput('')
    }

    const nextClick = () => {

        window.localStorage.removeItem("currentClueNum");
        window.localStorage.removeItem("hintTitle");
        window.localStorage.removeItem("isHint");

        if (parseInt(episodeOrder) === parseInt(episodeInfo.num_of_episodes) - 1) {
            window.location.href = `/detail/${storyId}/${parseInt(episodeOrder)}/reasoning`;
        } else {
            window.location.href = `/detail/${storyId}/${parseInt(episodeOrder)+1}`;
        } 
    }

    useEffect(() => {
        getClueList();
        // console.log("currentClueNum", currentClueNum)
        // console.log("clueNum", clueNum)
        if (currentClueNum > clueNum) {
            setIsLastClue(true);
            setSubTitle('모든 증거 수집이 완료되었습니다.');
            setIsDisabled(true);    
        } 
    }, [clueList, currentClueNum, isClue])

    useEffect(() => {
        window.localStorage.removeItem("hintTitle");
        window.localStorage.setItem("hintTitle", hintTitle);
    }, [hintTitle])

    useEffect(() => {
        window.localStorage.removeItem("isHint");
        window.localStorage.setItem("isHint", isHint);
    }, [isHint])

    return (
        <div className={styles.container}>
            <Header />
            <Scoreheader cluePoint={cluePoint} detectPoint={detectPoint}/>
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
                <div className={styles.rule_title}>
                    {ruleTitle}
                </div>
                <div className={styles.order_title}>
                    {orderTitle}
                </div>
                <div className={styles.hint_title}>
                    {hintTitle}
                </div>
                <input className={styles.clue_input} placeholder="단서를 입력하세요" value={clueInput}
                onKeyPress={handleKeyPress}
                disabled={isDisabled}
                onChange={(e) => {
                    setClueInput(e.target.value)
                }}/>
                <div className={styles.button_box}>
                    <div className={styles.clue_button} onClick={hintClick}>
                        {hintButton}
                    </div>
                    <div className={styles.clue_button} onClick={clueClick}>
                        {clueButton}
                    </div>
                </div>

                <div className={styles.clue_bottom}>
                    <div className={styles.collected_clue_title}>
                        단서 목록
                    </div>
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

        {isModalOpen && (
            <Hintmodal title={`${currentClueNum}번째 단서`} text={hintTitle} onClick={handleCloseModal}/>
        )}
        </div>
    )
}