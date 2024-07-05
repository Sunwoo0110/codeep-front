"use client";

import styles from "../../../../../styles/detail/Reasoning.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import Header from "../../../../_components/common/_header";
import Leftchat from "../../../../_components/detail/_leftchat";
import Rightchat from "../../../../_components/detail/_rightchat";

export default function Reasoning() {

    const [maintitle, setMainTitle] = useState('대화를 통해 범인을 검거하세요!');
    const [subtitle, setSubTitle] = useState('GPT 기반 추리형 영어 독해 학습 서비스');

    const [nextButton, setNextButton] = useState('결말 확인하기');
    const [isLastScript, setIsLastScript] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [content, setContent] = useState('');
    const [chats, setChats] = useState([
        { name: "Conan", content: "Who killed Narasaku?"}
    ]);
    const [order, setOrder] = useState(2);
    const [scriptNum, setScriptNum] = useState(100);

    const pathname = usePathname();
    const storyId = pathname.split("/")[2];
    const episodeOrder = pathname.split("/")[3];

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChat();
        } 
    };

    const sendChat = async () => {

        if (order <= scriptNum) {
            setChats(currentChats => [...currentChats, { name: "user", content: content }]);
            const res = await axios.get(`http://localhost:8000/scripts/get_script/${order}`);
            setChats(currentChats => [...currentChats, { name: "Conan", content: res.data.script[0].content }]);
            setContent('');
            setScriptNum(res.data.script[0].num_of_scripts);

            if (order === res.data.script[0].num_of_scripts) {
                setIsLastScript(true);
            }

            setOrder(order + 1);
        }
    }

    const nextClick = () => {
        window.location.href = `/detail/${storyId}/${parseInt(episodeOrder)+1}`
    }


    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.reasoning_container}>
                <div className={styles.main_title}>
                    {maintitle}
                </div>
                {
                    isLastScript ? (
                        <div className={styles.script_button} onClick={nextClick}>
                            {nextButton}
                        </div>
                    ) : null
                }
                
                <div id="chatting" className={styles.reasoning_context_container}>
                    {chats.map((chat, index) => (
                        chat.name === "Conan" ?
                        <Leftchat key={index} name={chat.name} content={chat.content} /> :
                        <Rightchat key={index} name={chat.name} content={chat.content} /> 
                    ))}
                </div>

                <div className={styles.reasoning_textbox}>
                    <textarea id="chattext" className={styles.reasoning_textarea} placeholder="메세지를 입력하세요" value={content}
                    onChange={(e) => {setContent(e.target.value)}}
                    onKeyPress={handleKeyPress}
                    disabled={isDisabled}/>
                    <button style={{ backgroundColor: "inherit", border: "none" }} >
                        <img src="/images/send.png" alt="send" className={styles.reasoning_image_button}
                            onClick={sendChat} />
                    </button>
                </div>
            </div>
        </div>
    )
}