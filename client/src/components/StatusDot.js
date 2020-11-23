import React from "react";

const StatusDot = ({on = false}) => {

    return (<div className={`StatusDot${on ? ' StatusDot--on' : ''}`}>
        
    </div>);
}

export default StatusDot;