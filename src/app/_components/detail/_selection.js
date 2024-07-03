"use client";

import styles from "../../../styles/detail/_selection.module.css"
import { usePathname, useRouter } from 'next/navigation';
import { useState } from "react";

export default function Selection({detailId, onSelect}) {

    const [selectionList, setSelectionList] = useState([
        {id: 1, text: "111111", evidence: "A"},
        {id: 2, text: "222222", evidence: "B"},
        {id: 3, text: "333333", evidence: "C"},
    ]);

    const handleSelectionClick = (selection) => {
        onSelect(selection); // 선택된 항목을 부모 컴포넌트로 전달
    };

    return (
        <div className={styles.selection_container}>
            {selectionList.map((selection, index) => (
                <div 
                    key={index}
                    className={styles.selection_text}
                    onClick={() => handleSelectionClick(selection)}>
                    {selection.text}
                </div>
            ))}
            {/* <div className={styles.selection_text}>
                {detailId}
            </div> */}
        </div>
    )
}