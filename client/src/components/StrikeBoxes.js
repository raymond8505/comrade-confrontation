import React from "react";

const StrikeBoxes = ({strikes}) => {

    const renderBoxes = strikes => {

        const toRet = [];

        for(let s = 1; s <= 3; s++)
        {
            toRet.push(<li key={`strike-box_${s}`} className={`StrikeBoxes__box${s <= strikes ? ' StrikeBoxes__box--show' : ''}`}></li>);
        }

        return toRet;
    }
    return (<ul className="StrikeBoxes">
        
        {renderBoxes(strikes)}
    </ul>);
}

export default StrikeBoxes;