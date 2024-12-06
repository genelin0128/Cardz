import React from 'react';


const CardzContent = ({ width = '100%', height = '100%', children, useEllipsis = false }) => {
    const cardzContentContainer = {
        width: width,
        height: height,
        overflow: 'hidden',
    };

    const cardzContent = {
        width: '100%',
        height: '100%',
        backgroundColor: '#cfdfe3',
        borderRadius: '10px',
        wordBreak: 'break-word',
        overflowY: useEllipsis ? 'hidden' : 'auto',
        display: useEllipsis ? '-webkit-box' : 'block',
        WebkitLineClamp: useEllipsis ? '4' : 'unset',
        WebkitBoxOrient: 'vertical',
        textOverflow: useEllipsis ? 'ellipsis' : 'clip',
    };

    return (
        <div style={cardzContentContainer} className='my-2'>
            <div style={cardzContent} className='px-2'>
                {children ? (
                    children
                ) : (
                    <p className='m-0'>No content in this post.</p>
                )}
            </div>
        </div>
    );
}

export default CardzContent;