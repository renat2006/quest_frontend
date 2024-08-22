import React, { useRef, useState, useEffect } from 'react';
import { Button, Slider } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo, faUndo } from '@fortawesome/free-solid-svg-icons';

const CustomAudioPlayer = ({ audioSrc, autoPlay }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    const skipTime = 5


    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.playbackRate = playbackRate;

            if (autoPlay) {
                audio.play();
                setIsPlaying(true);
            }
        }
        return () => {
            if (audio) {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, [playbackRate, autoPlay]);

    const handlePlayPause = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (value) => {
        const newTime = (value / 100) * duration;
        setCurrentTime(newTime);
    };

    const handleSeekEnd = (value) => {
        const newTime = (value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleSkip = (amount) => {
        const newTime = Math.min(Math.max(0, currentTime + amount), duration);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const togglePlaybackRate = () => {
        const newRate = playbackRate === 2 ? 1 : playbackRate + 0.5;
        setPlaybackRate(newRate);
        audioRef.current.playbackRate = newRate;
    };

    return (
        <div className="flex flex-col items-center w-full bg-white">
            <audio ref={audioRef} src={audioSrc} />
            <Slider
                aria-label="Music progress"
                value={(currentTime / duration) * 100}
                max={100}
                onValueChange={handleSeek}
                onChangeEnd={handleSeekEnd}
                className="w-full"
                classNames={{
                    track: "border-s-primary-100",
                    thumb: "w-3 h-3 after:w-2 after:h-2",
                    filler: "bg-gradient-to-r from-primary-100 to-primary-500"
                }}
                color="primary"
                size="sm"
            />
            <div className="flex justify-between w-full text-xs mt-1 text-gray-700">
                <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
                <span>{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
            </div>
            <div className="flex w-full items-center justify-center mt-2">
                <div className="absolute left-4">
                    <Button
                        isIconOnly
                        className="data-[hover]:bg-foreground/10"
                        radius="full"
                        variant="light"
                        onClick={togglePlaybackRate}
                    >
                        <span className="text-gray-700">{playbackRate}x</span>
                    </Button>
                </div>

                <div className="flex items-center justify-center space-x-4">
                    <Button
                        isIconOnly
                        className="data-[hover]:bg-foreground/10 p-6"
                        radius="full"
                        variant="light"
                        onClick={() => handleSkip(-skipTime)}
                    >
                        <FontAwesomeIcon icon={faUndo} />
                        <span className="ml-1 text-gray-700">{skipTime}</span>
                    </Button>
                    <Button
                        isIconOnly
                        className="flex items-center bg-primary  text-white p-7"
                        radius="full"
                        variant="flat"
                        onClick={handlePlayPause}
                    >
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="2x" />
                    </Button>
                    <Button
                        isIconOnly
                        className="data-[hover]:bg-foreground/10 p-6"
                        radius="full"
                        variant="light"
                        onClick={() => handleSkip(skipTime)}
                    >
                        <span className="mr-1 text-gray-700">{skipTime}</span>
                        <FontAwesomeIcon icon={faRedo} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomAudioPlayer;
