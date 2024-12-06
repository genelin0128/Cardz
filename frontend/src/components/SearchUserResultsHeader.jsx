import React from 'react';
import './FollowingAndHotPostsAndSearchPostAndUserResultsHeaderAnimation.css'

const SearchPostResultsHeader = () => {
    return (
        <div className="position-relative overflow-hidden p-0" style={{height: '60px', width: '100%'}}>
            <div className="d-flex align-items-center" style={{
                background: 'linear-gradient(to right, #fad13c, #faa952)',
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
                                d="M12 12c2.5 0 4.5-2 4.5-4.5S14.5 3 12 3 7.5 5 7.5 7.5 9.5 12 12 12z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14c4.5 0 9 2.5 9 7.5H3c0-5 4.5-7.5 9-7.5z"
                            />
                        </svg>
                        <h2 className="mb-0 text-white fw-bold" style={{letterSpacing: '0.05em'}}>
                            Search User Results
                        </h2>
                    </div>
                </div>
            </div>
            <div style={{
                height: '2px',
                background: 'linear-gradient(to right, #faa952, #fad13c, #fae152)'
            }}>
            </div>
        </div>
    );
};

export default SearchPostResultsHeader;
