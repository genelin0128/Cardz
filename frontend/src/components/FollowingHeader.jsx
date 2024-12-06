import React from 'react';
import './FollowingAndHotPostsAndSearchPostAndUserResultsHeaderAnimation.css'

const FollowingHeader = () => {
    return (
        <div className="position-relative overflow-hidden p-0" style={{height: '60px', width: '100%'}}>
            <div className="d-flex align-items-center" style={{
                background: 'linear-gradient(to right, #c9f5ff, #0dcaf0)',
                height: '58px'
            }}>
                <div className="d-flex justify-content-center align-items-center w-100">
                    <div className="d-flex align-items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="me-2 pulse-animation"
                            width="28"
                            height="28"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <h2 className="mb-0 text-white fw-bold" style={{letterSpacing: '0.05em'}}>
                            Following
                        </h2>
                    </div>
                </div>
            </div>
            <div style={{
                height: '2px',
                background: 'linear-gradient(to right, #0dcaf0, #0d6efd, #c9f5ff)'
            }}>
            </div>
        </div>
    );
};

export default FollowingHeader;
