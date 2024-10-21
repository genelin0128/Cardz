import React from 'react';
import './FollowingAndHotPostsAndSearchPostAndUserResultsHeaderAnimation.css'

const SearchPostResultsHeader = () => {
    return (
        <div className="position-relative overflow-hidden p-0" style={{height: '60px', width: '100%'}}>
            <div className="d-flex align-items-center" style={{
                background: 'linear-gradient(to right, #58e8da, #58e897)',
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
                                d="M4 4h16v16H4V4z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 8h8M8 12h8M8 16h6"
                            />
                        </svg>
                        <h2 className="mb-0 text-white fw-bold" style={{letterSpacing: '0.05em'}}>
                            Search Post Results
                        </h2>
                    </div>
                </div>
            </div>
            <div style={{
                height: '2px',
                background: 'linear-gradient(to right, #17d13c, #80ffb7, #17ff97)'
            }}>
            </div>
        </div>
    );
};

export default SearchPostResultsHeader;
