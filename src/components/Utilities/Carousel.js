"use client";

import React, { useState, useEffect } from 'react';

const Carousel = ({ images }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [previousImage, setPreviousImage] = useState(null);

    useEffect(() => {
        if (!Array.isArray(images)) {
            console.error('Images prop must be an array.');
            return;
        }

        const interval = setInterval(() => {
            setPreviousImage(currentImage);
            setCurrentImage(currentImage => {
                const nextImage = (currentImage + 1) % images.length;
                setTimeout(() => setPreviousImage(null), 4000); // Wait for 4 seconds before hiding previous image
                return nextImage;
            });
        }, 10000); // Change interval time as needed
        return () => clearInterval(interval);
    }, [currentImage, images.length]);

    return (
        <div className="w-3/4 p-4 h-5/6 bg-white shadow-lg rounded-3xl relative overflow-hidden">
            {images.map((src, index) => (
                <div
                    key={index}
                    style={{ zIndex: index === currentImage ? 2 : index === previousImage ? 1 : 0 }}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={src}
                        alt={`Slide ${index}`}
                        className="rounded-2xl object-cover w-full h-full"
                    />
                </div>
            ))}
        </div>
    );
};

export default Carousel;