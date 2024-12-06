import { useState } from 'react';

const ImageSliderInModal = ({images}) => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const slider = {
        width: '440px',
        height: '330px',
        position: 'relative',
    };

    const slide = {
        width: '100%',
        height: '100%',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${images[currentIndex]})`,
    };

    const leftArrow = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        left: '5%',
        fontSize: '80px',
        zIndex: 1,
        cursor: 'pointer',
        color: '#cafbff',
    };

    const rightArrow = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        right: '5%',
        fontSize: '80px',
        zIndex: 1,
        cursor: 'pointer',
        color: '#cafbff',
    };

    const dotsContainer = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        transform: 'translateX(-50%)',
        left: '50%',
        top: '90%',
        width: '100%',
    };

    const dot = (isSelected) => ({
        fontSize: '15px',
        zIndex: 1,
        cursor: 'pointer',
        margin: '0px 3px',
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
        <div style={slider}>
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
            <div
                style={slide}
            >

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

export default ImageSliderInModal;