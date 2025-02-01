import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = ({ loading }) => {
    if (!loading) return null;
    return (
        <div className="loading-spinner">
            <ClipLoader color={"#36D7B7"} loading={loading} size={50} />
        </div>
    );
};

export default Loading;