import { toast } from "react-hot-toast";

export const compressAndConvertImage = async (file) => {
    const toastId = toast.loading("Сжатие изображения...");
    try {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
        };
        const compressedImage = await imageCompression(file, options);
        toast.success('Изображение оптимизировано', { id: toastId });
        return compressedImage;
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
                    mimeType: 'video/mp4; codecs=avc1.42E01E, mp4a.40.2', // Используем MP4 формат
                    videoBitsPerSecond: 1000000,  // Битрейт 1 Мбит/с
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
                    const compressedBlob = new Blob(chunks, { type: 'video/mp4' });
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

        const compressedFile = new File([videoBlob], `${file.name}`, { type: 'video/mp4' });
        toast.success('Видео оптимизировано', { id: toastId });
        return compressedFile;
    } catch (error) {
        toast.error(`Ошибка при сжатии видео: ${error.message}`, { id: toastId });
        console.error('Ошибка при сжатии видео:', error);
        return file;
    }
};
