import React from 'react';
import './FollowingAndHotPostsAndSearchPostAndUserResultsHeaderAnimation.css'

const HotPostsHeader = () => {

    return (
        <div className="position-relative overflow-hidden p-0" style={{height: '60px', width: '100%'}}>
            <div className="d-flex align-items-center" style={{
                background: 'linear-gradient(to right, #f97316, #dc2626)',
                height: '58px'
            }}>
                <div className="d-flex justify-content-center align-items-center w-100">
                    <div className="d-flex align-items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="me-2"
                            width="30"
                            height="30"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                            style={{animation: 'pulse 2s infinite'}}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                            />
                        </svg>
                        <h2 className="mb-0 text-white fw-bold" style={{letterSpacing: '0.05em'}}>
                            Hot Posts
                        </h2>
                    </div>
                </div>
            </div>
            <div style={{
                height: '2px',
                background: 'linear-gradient(to right, #fde047, #ef4444, #ec4899)'
            }}>
            </div>
        </div>
    );
};

export default HotPostsHeader;
