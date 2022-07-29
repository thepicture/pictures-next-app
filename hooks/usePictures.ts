import { useEffect, useState } from 'react'

const IMAGE_WIDTH_IN_PIXELS = 640;
const IMAGE_HEIGHT_IN_PIXELS = 320;

const usePictures = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pictures, setPictures] = useState<string[]>([]);
    useEffect(() => {
        const loadPictures = async () => {
            for (let i = 0; i < 2; i++) {
                const response = await fetch(`https://random.imagecdn.app/${IMAGE_WIDTH_IN_PIXELS}/${IMAGE_HEIGHT_IN_PIXELS}`);
                setPictures(prev => [...prev, response.url]);
            }
            setPictures(prev => [...prev, ...pictures].filter((value: string, index: number, array: string[]) => {
                return array.indexOf(value) === index
            })
            );
            setIsLoading(false);
        };
        loadPictures();
    }, []);
    return { pictures, setPictures, isLoading };
}

export default usePictures