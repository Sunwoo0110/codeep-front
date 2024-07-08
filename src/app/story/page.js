"use client";

import styles from "../../styles/story/Story.module.css"
import axios from "axios";
import { useState, useEffect } from "react";

import Header from "../_components/common/_header";
import Storybox from "../_components/story/_storybox";
import { Stick } from "next/font/google";

export default function Story() {

    const [maintitle, setMainTitle] = useState('원하는 추리 소설을 선택하세요!');
    const [subtitle, setSubTitle] = useState('난이도에 맞추어 생성해드립니다');
    const [storyList, setStoryList] = useState([]);

    const [name, setName] = useState("");
    const [selectedOption, setSelectedOption] = useState('');

    const options = [
        { level: 1, text: '초급' },
        { level: 2, text: '중급' },
        { level: 3, text: '고급' },
    ];

    const register = async () => {
        const res = await axios.post("http://127.0.0.1:8000/users/register", {
                name: name,
            }
        )

        if (res.data.result === "success"){
            window.localStorage.removeItem("userId");
            window.localStorage.setItem("userId", res.data.user._id);
        } else {
            alert("로그인에 실패하였습니다.")
        }
    }

    const startStats = async () => {
        const res = await axios.post("http://localhost:8000/stats/ep1_start", {
            name: name,
        })
        if (res.data.result === "success"){
            // window.localStorage.removeItem("userId");
            // window.localStorage.setItem("userId", res.data.user._id);
        } else {
            alert("시작 스탯 생성에 실패하였습니다.")
        }
    }

    const remove = async (storyId) => {
        await axios.post("http://localhost:8000/chattings/remove_all_chat", {
            story_id: storyId,
            name: name,
            level: selectedOption.level
        })

        await axios.post("http://localhost:8000/points/remove_point", {
            story_id: storyId,
            name: name,
            level: selectedOption.level
        })

        window.localStorage.removeItem("currentClueNum");
        window.localStorage.removeItem("hintTitle");
        window.localStorage.removeItem("isHint");
        window.localStorage.removeItem("isArrest");
    }

    const handleOptionChange = (event) => {
        const selectedOption = options.find(option => option.text === event.target.value);
        setSelectedOption(selectedOption);
        handleOptionSelect(selectedOption);
    };

    const handleOptionSelect = (option) => {
        window.localStorage.removeItem("userLevel");
        window.localStorage.setItem("userLevel", option.level);
    }

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handleStoryboxClick = async (storyId, storyTitle) => {
        if (name.trim() === '' || !selectedOption) {
            console.log(name);
            alert('이름과 난이도를 모두 입력하세요');
            return;
        }

        else{
            await register();
            await startStats();
            await remove(storyId);

            window.localStorage.removeItem("userName");
            window.localStorage.setItem("userName", name);
            window.localStorage.removeItem("storyId");
            window.localStorage.setItem("storyId", storyId);
            window.localStorage.removeItem("storyTitle");
            window.localStorage.setItem("storyTitle", storyTitle);
            
            window.location.href = `/detail/${storyId}/1`
        }
    };

    useEffect(() => {
        const getStory = async () => {   
            const res = await axios.get(`http://localhost:8000/stories/info/${window.localStorage.getItem("userAge")}`)
    
            if (res.data.result === "success"){
                console.log(res.data.stories);
                await setStoryList(res.data.stories);
                console.log(storyList);
            } else {
                alert("스토리 불러오기에 실패하였습니다.")
            }
        }
        getStory();
    }, [])

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.story_container}>
                <div className={styles.story_title}>
                    {maintitle}
                </div>
                <div className={styles.sub_title}>
                    {subtitle}
                </div>
                <input className={styles.main_input} placeholder="이름을 입력하세요"
                value={name}
                onChange={handleInputChange}/>
                <select className={styles.main_input}
                    value={selectedOption.level || ''}
                    onChange={handleOptionChange}>
                    <option value="" disabled>난이도를 선택하세요</option>
                            {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.text}
                                </option>
                            ))}
                </select>
                <div className={styles.story_list}>
                    {storyList.map((story, index) => (
                        <Storybox 
                            key={index}
                            title={story.title}
                            sub_title={story.subtitle}
                            description={story.description}
                            img={story.img}
                            onClick={() => handleStoryboxClick(story._id, story.title)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}