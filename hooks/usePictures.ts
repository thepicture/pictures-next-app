import { useEffect, useState } from 'react'

const usePictures = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pictures, setPictures] = useState<string[]>([]);
    useEffect(() => {
        const loadPictures = async () => {
            const response = await fetch('/api/pictures');
            const json = await response.json() as { pictures: string[] };
            setPictures(prev => [...prev, ...json.pictures]);
            setIsLoading(false);
        };
        loadPictures();
    }, []);
    return { pictures, setPictures, isLoading };
}

export default usePictures