"use client";

import styles from "../../styles/story/Story.module.css"
import axios from "axios";
import { useState, useEffect } from "react";

import Header from "../_components/common/_header";
import Storybox from "../_components/story/_storybox";

export default function Story() {

    const [maintitle, setMainTitle] = useState('원하는 추리 소설을 선택하세요!');
    const [subtitle, setSubTitle] = useState('난이도에 맞추어 생성해드립니다');
    const [storyList, setStoryList] = useState([]);

    const [selectedOption, setSelectedOption] = useState('');

    const options = [
        { level: 1, text: '초급' },
        { level: 2, text: '중급' },
        { level: 3, text: '고급' },
    ];

    const handleOptionChange = (event) => {
        const selectedOption = options.find(option => option.text === event.target.value);
        setSelectedOption(selectedOption);
        handleOptionSelect(selectedOption);
    };

    const handleOptionSelect = (option) => {
        window.localStorage.removeItem("userLevel");
        window.localStorage.setItem("userLevel", option.level);
    }

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
        window.localStorage.removeItem("collectedClueList");
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
                            img="/images/conan/story.png"
                            storyId={story._id}
                            episodeId={story.first_ep[0]._id}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}