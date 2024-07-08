"use client";

import styles from "../../../../../styles/detail/Reasoning.module.css";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Header from "../../../../_components/common/_header";
import Leftchat from "../../../../_components/detail/_leftchat";
import Rightchat from "../../../../_components/detail/_rightchat";
import Arrest from "../../../../_components/detail/_arrest";

export default function Reasoning() {

    const [maintitle, setMainTitle] = useState('대화를 통해 범인을 검거하세요!');
    const [subtitle, setSubTitle] = useState('위의 아이콘을 클릭하여 수집된 단서를 참고하세요.');

    const [nextButton, setNextButton] = useState('결말 확인하기');
    const [isLastChat, setIsLastChat] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [content, setContent] = useState('');
    const [question, setQuestion] = useState('');
    const [chats, setChats] = useState([]);
    const [point, setPoint] = useState(0);
    const [totalPoint, setTotalPoint] = useState(0);
    const [arrestTitle, setArrestTitle] = useState('');
    const [arrestContent, setArrestContent] = useState('');
    const [arrestImg, setArrestImg] = useState('');

    const pathname = usePathname();
    const storyId = pathname.split("/")[2];
    const episodeOrder = pathname.split("/")[3];
    const chatContainerRef = useRef(null);

    const level = window.localStorage.getItem("userLevel");
    const userName = window.localStorage.getItem("userName");

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChat();
        } 
    };

    const sendChat = async () => {
        setIsLoading(true);
        await getPoint(content);
        console.log(chats);
        setContent('');
        setIsLoading(false); 
    }

    const updateStat = async () => {
        const is_arrest = (arrestTitle === "범인 검거 성공") ? 1 : 0;
        const res = await axios.post(`http://localhost:8000/stats/update_stat`, {
            story_id: storyId,
            name: userName,
            level: level,
            is_arrest: is_arrest
        });

        if (res.data.result === "success") {
            console.log("success");
        }
    }

    const nextClick = async () => {
        await updateStat();
        window.location.href = `/detail/${storyId}/${parseInt(episodeOrder)+1}`
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const getPoint = async (input) => { 

        if (input === "") {
            alert("메세지를 입력해주세요.");
            return 0;
        }
        
        const res = await axios.post(`http://localhost:8000/points/detect_point`, {
            story_id: storyId,
            name: userName,
            level: level,
            question: chats[chats.length-1].content,
            input: input
        });

        if (res.data.result === "success") {
            setPoint(res.data.point.point);
            setTotalPoint(res.data.point.total_point);

            console.log(res.data.point.point);
            console.log(res.data.point.total_point);

            setChats(currentChats => [...currentChats, { name: userName, content: input, point: res.data.point.point}]);

            await createChat(input, res.data.point.point);
        } else if (res.data.result === "failure") {
            // 채팅 끝내기
            setIsLastChat(true);
            setIsDisabled(true);

            setArrestTitle("범인 검거 실패");
            setArrestContent(res.data.content);
            setArrestImg("/images/conan/fail.png");
            setIsModalOpen(true);

            window.localStorage.removeItem("isArrest");
            window.localStorage.setItem("isArrest", false);
            
            setChats(currentChats => [...currentChats, { name: userName, content: input, point: 0}]);
            // setChats(currentChats => [...currentChats, { name: "Conan", content: res.data.content, point: 0}]);
            
        } else {
            alert("오류가 발생하였습니다.\n다시 시도해주세요.");
        }
        return 0;
    }

    const createChat = async (input, point) => {

        if (input === "") {
            alert("메세지를 입력해주세요.");
        }
        else {
            const res = await axios.post(`http://localhost:8000/chattings/create_chat`, {
                story_id: storyId,
                name: userName,
                level: level,
                input: input,
                point: point
            });
    
            if (res.data.result === "success") {
                setChats(currentChats => [...currentChats, { name: "Conan", content: res.data.chatting.content, point: point}]);
                if (res.data.chatting.is_end === 1){
                    setIsLastChat(true);
                    setIsDisabled(true);

                    setArrestTitle("범인 검거 성공");
                    setArrestContent(res.data.chatting.content);
                    setArrestImg("/images/conan/success.png");
                    setIsModalOpen(true);

                    window.localStorage.removeItem("isArrest");
                    window.localStorage.setItem("isArrest", true);
                }
            }
        }
    }

    useEffect( () => {
        const getChats = async () => {
            const res = await axios.post(`http://localhost:8000/chattings/get_all_chat`, {
                story_id: storyId,
                name: userName,
                level: level
            });
            if (res.data.result === "success") {
                const transformedChats = res.data.chattings.map(chat => {
                    return {
                        name: chat.is_user === 0 ? "Conan" : userName,
                        content: chat.chat,
                        point: chat.point
                    };
                });
                setChats(transformedChats);
                console.log(transformedChats);

            } else {
                if (chats.length === 0) {
                    setIsLoading(true);
                    const res = await axios.post(`http://localhost:8000/chattings/create_chat`, {
                        story_id: storyId,
                        name: userName,
                        level: level,
                        point: 0
                    });
            
                    if (res.data.result === "success") {
                        setQuestion(res.data.chatting.content);
                        setChats(currentChats => [...currentChats, { name: "Conan", content: res.data.chatting.content, point: 0}]);
                        if (res.data.chatting.is_end === 1){
                            setIsLastChat(true);
                        }
                    }
                    setIsLoading(false);
                }

            }
        }

        const getTotalPoint = async () => {
            const res = await axios.post(`http://localhost:8000/points/all_detect_point`, {
                story_id: storyId,
                name: userName,
                level: level
            });

            if (res.data.result === "success") {
                setTotalPoint(res.data.total_point);
            }
        }
        getChats();
        getTotalPoint();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);


    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.reasoning_container}>
                <div className={styles.main_title}>
                    {maintitle}
                </div>
                <div className={styles.sub_title}>
                    {subtitle}
                </div>
                <div className={styles.point_title}>
                    {`총 포인트: ${totalPoint}점`}
                </div>
                {
                    isLastChat ? (
                        <div className={styles.script_button} onClick={nextClick}>
                            {nextButton}
                        </div>
                    ) : null
                }
                
                <div id="chatting" className={styles.reasoning_context_container}
                ref={chatContainerRef}>
                    {chats.map((chat, index) => (
                        chat.name === "Conan" ?
                        <Leftchat key={index} name={chat.name} content={chat.content} /> :
                        <Rightchat key={index} name={chat.name} content={chat.content} point={chat.point}/> 
                    ))}
                </div>

                <div className={styles.reasoning_textbox}>
                    <textarea id="chattext" className={styles.reasoning_textarea} placeholder="메세지를 입력하세요" value={content}
                    onChange={(e) => {setContent(e.target.value)}}
                    onKeyPress={handleKeyPress}
                    disabled={isDisabled}/>
                    <button style={{ backgroundColor: "inherit", border: "none" }} >
                        {isLoading ? (
                            <img src="/images/loading.png" alt="loading" className={styles.reasoning_loading_button} />
                        ) : (
                            <img src="/images/send.png" alt="send" className={styles.reasoning_image_button} 
                            onClick={sendChat}/>
                        )}
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <Arrest title={arrestTitle} content={arrestContent} point={totalPoint} img={arrestImg} onClose={handleCloseModal}/>
            )}
        </div>
    )
}