
import SparkMD5 from 'spark-md5';


/**
 * 异步分块计算文件的md5码
 * @param file 文件
 * @param chunkSize 块大小 
 * @returns 文件md5码
 */
export const calculateFileMD5Chunked = async (file: File | Blob, chunkSize = 5 * 1024 * 1024): Promise<string> => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    return new Promise((resolve, reject) => {
        fileReader.onload = (e) => {
            if (e.target?.result) {
                spark.append(e.target.result as ArrayBuffer);
                currentChunk++;

                if (currentChunk < chunks) {
                    loadNextChunk();
                } else {
                    resolve(spark.end());
                }
            } else {
                reject(new Error('读取文件失败'));
            }
        };

        fileReader.onerror = () => reject(new Error('读取文件出错'));

        function loadNextChunk() {
            const start = currentChunk * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            fileReader.readAsArrayBuffer(file.slice(start, end));
        }

        loadNextChunk();
    });
} 