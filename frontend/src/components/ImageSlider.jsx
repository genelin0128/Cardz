import {useEffect, useState} from 'react';

const ImageSlider = ({images}) => {

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [images]);

    const slider = {
        width: '160px',
        height: '160px',
        position: 'relative',
    };

    const slide = {
        width: '100%',
        height: '100%',
        borderRadius: '10px',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `url(${images[currentIndex]})`,
    };

    const leftArrow = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        left: '5%',
        fontSize: '45px',
        zIndex: 1,
        cursor: 'pointer',
        color: '#cafbff',
    };

    const rightArrow = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        right: '5%',
        fontSize: '45px',
        zIndex: 1,
        cursor: 'pointer',
        color: '#cafbff',
    };

    const dotsContainer = {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        top: '90%',
        width: '100%',
    };

    const dot = (isSelected) => ({
        fontSize: '10px',
        zIndex: 1,
        cursor: 'pointer',
        margin: '0 3px',
        color: isSelected ? '#000' : '#888',
    });

    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToImage = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div style={slider} onClick={e => {e.stopPropagation();}}>
            <div
                style={leftArrow}
                onClick={goToPrevious}
            >
                ❰
            </div>
            <div
                style={rightArrow}
                onClick={goToNext}
            >
                ❱
            </div>
            <div style={slide}>

            </div>
            <div style={dotsContainer}>
                {images.map((image, imageIndex)=> (
                    <div
                        key={imageIndex}
                        style={dot(currentIndex === imageIndex)}
                        onClick={() => goToImage(imageIndex)}
                    >
                        ●
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;