import React from "react";

const Alert = ({alert}) => {

    return (<div className={`Alert Alert--${alert.type}`}>
        {alert.msg}
    </div>);
}

export default Alert;