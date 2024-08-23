import { toast } from "react-hot-toast";
import imageCompression from 'browser-image-compression';

export const compressAndConvertImage = async (file) => {
    const toastId = toast.loading("Сжатие изображения...");
    try {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: 'image/webp'
        };
        const compressedImage = await imageCompression(file, options);
        const webpFile = new File([compressedImage], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });
        toast.success('Изображение оптимизированно', { id: toastId });
        return webpFile;
    } catch (error) {
        toast.error('Ошибка при сжатии изображения', { id: toastId });
        console.error('Ошибка при сжатии изображения:', error);
        return file;
    }
};

export const compressAndConvertVideo = async (file) => {
    const toastId = toast.loading("Сжатие видео...");
    try {
        const videoBlob = await new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
                const mediaRecorderOptions = {
                    mimeType: 'video/webm; codecs=vp9',
                    videoBitsPerSecond: 500000,
                };
                const stream = video.captureStream();
                const mediaRecorder = new MediaRecorder(stream, mediaRecorderOptions);

                const chunks = [];
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const compressedBlob = new Blob(chunks, { type: 'video/webm' });
                    resolve(compressedBlob);
                };

                mediaRecorder.onerror = (err) => {
                    reject(err);
                };

                mediaRecorder.start();
                video.play();


                const stopRecording = () => {
                    if (mediaRecorder.state === "recording") {
                        mediaRecorder.stop();
                    }
                };

                setTimeout(stopRecording, 60000);
                video.onended = stopRecording;
            };
        });

        const compressedFile = new File([videoBlob], `${file.name.split('.')[0]}.webm`, { type: 'video/webm' });
        toast.success('Видео оптимизированно', { id: toastId });
        return compressedFile;
    } catch (error) {
        toast.error(`Ошибка при сжатии видео: ${error.message}`, { id: toastId });
        console.error('Ошибка при сжатии видео:', error);
        return file;
    }
};
