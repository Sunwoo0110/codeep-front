"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from 'next/navigation';

import styles from "../../../styles/detail/Detail.module.css"
import Header from "../../_components/common/_header";
import Detailbox from "../../_components/detail/_detailbox";
import Selection from "../../_components/detail/_selection";
import Titlebox from "../../_components/detail/_titlebox";
import Evidence from "@/app/_components/detail/_evidence";

export default function Detail() {

    const pathname = usePathname();
    const storyId = pathname.split("/")[2];

    const detailBoxRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const [detailId, setDetailId] = useState(1);
    const [detailList, setDetailList] = useState([
        {id: 1, text: "111111Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        {id: 2, text: "222222Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        {id: 3, text: "333333Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
        {id: 4, text: "444444Heiji was on his way to the warehouse, following a tip he received about suspicious activities. The old building stood eerily silent as he approached it. His heart pounded with a mix of fear and determination. He knew Kazuha was in danger, and every second counted. As he pushed open the creaky door, he heard faint sounds coming from deep inside the warehouse."},
    ]); // 계속 추가

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [evidenceId, setEvidenceId] = useState(1);

    const handleSelectionClick = (selection) => {
        setEvidenceId(selection.evidence);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEvidenceId(0);
    };

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
            {/* <Titlebox /> */}
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
                    <Selection detailId={detailList[activeIndex].id} onSelect={handleSelectionClick}/>
                </div>
            </div>
            {isModalOpen && (
                <Evidence evidenceId={evidenceId} onClose={handleCloseModal}/>
            )}
        </div>
    )

}