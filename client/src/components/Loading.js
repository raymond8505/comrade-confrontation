import React from "react";

const Loading = ({text = 'Loading...'}) => {

    return (<div className="Loading">
        <i className="fas fa-spinner"></i>
        <span className="Loading__text">{text}</span>
    </div>);
}

export default Loading;