<template>
    <div class="upload-container">
        <h2 class="title">视频文件上传</h2>

        <div class="upload-box" @dragover.prevent @drop.prevent="onDrop" @click="selectFile">
            <p v-if="!file">点击或拖拽上传视频文件</p>
            <p v-else>已选择：{{ file.name }}（{{ formatSize(file.size) }}）</p>
        </div>

        <input ref="fileInput" type="file" accept="video/*" class="hidden" @change="onFileChange" />

        <!-- 上传按钮仅在文件已选择时显示 -->
        <div v-if="file && !uploading" class="actions">
            <button @click="startUpload">开始上传</button>
        </div>

        <!-- 上传中进度条 -->
        <div v-if="uploading" class="progress">
            <div class="bar" :style="{ width: progress + '%' }"></div>
            <span>{{ progress }}%</span>
        </div>

        <p v-if="uploadingMessage && !uploadSuccess" class="uploading-message">{{ uploadingMessage }}</p>
        <p v-if="uploadSuccess" class="success">🎉 上传成功！</p>
        <p v-if="error" class="error">❌ 上传失败：{{ error }}</p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { calculateFileMD5Chunked } from '@/utils/uploadUtils'
import { ElMessage } from 'element-plus'
import { uploadFileMultiBlock, checkFileUploadIsOk, fileUploadPreHandle } from '@/api/fileApi'
import type { FileUploadMultiBlockParams } from '@/api/entity'

// 视频文件
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const progress = ref(0)
const uploadSuccess = ref(false)
const error = ref('')
// 上传进度提示
const uploadingMessage = ref('')
// 分块大小
const chunkSize = 5 * 1024 * 1024

// 点击上传对话框
function selectFile() {
    fileInput.value?.click()
}

// 选择文件
function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files?.length) {
        file.value = target.files[0]
        reset()
    }
}

function onDrop(e: DragEvent) {
    if (e.dataTransfer?.files?.length) {
        file.value = e.dataTransfer.files[0]
        reset()
    }
}

// 计算文件大小
function formatSize(size: number) {
    const mb = size / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
}


// 重置上传进度
function reset() {
    progress.value = 0
    uploading.value = false
    uploadSuccess.value = false
    error.value = ''
}


// 重传失败块
const reuploadChunk = async (chunkIds: number[], fileUUID: string, totalChunks: number, fileSize: number) => {
    let failChunk: Blob;
    for (let i = 0; i < chunkIds.length; i++) {
        if (chunkIds[i] == totalChunks - 1) {
            failChunk = file.value?.slice(chunkIds[i] * chunkSize, fileSize) as Blob;
        }
        else {
            failChunk = file.value?.slice(chunkIds[i] * chunkSize, chunkIds[i] * chunkSize + chunkSize) as Blob;
        }
        // 计算失败块的md5码
        const chunkMd5 = await calculateFileMD5Chunked(failChunk)
        await uploadFileMultiBlock({
            fileUUID: fileUUID,
            chunkSize: chunkSize,
            chunkId: chunkIds[i],
            chunkMd5: chunkMd5,
            file: failChunk
        }).then((resp) => {
            if (resp.data.data) {
                uploadingMessage.value = '正在重传第 ' + (i + 1) + ' / ' + chunkIds.length + ' 块文件'
            }
        })
    }
}

// 开始上传
async function startUpload() {
    if (!file.value) {
        ElMessage.error("请选择视频文件")
        return;
    }
    // 计算文件的md5码
    const md5 = await calculateFileMD5Chunked(file.value)
    // 文件大小
    const fileSize = file.value.size
    // 文件的uuid
    let fileUUIID: string = '', chunkCount = 0, achieveCount = 0;

    uploading.value = true

    // 分块上传预处理
    const preUploadForm = new FormData()
    preUploadForm.append('filename', file.value.name)
    preUploadForm.append('fileSize', fileSize.toString())
    preUploadForm.append('md5', md5)
    await fileUploadPreHandle(file.value.name, fileSize, md5, null).then((resp) => {
        if (resp.data.status == 200) {
            fileUUIID = resp.data.data.fileUUID;
            chunkCount = resp.data.data.chunkCount;
        }
        else {
            ElMessage.error('上传失败');
            return
        }
    })

    if (fileUUIID.length == 0) {
        ElMessage.error('上传失败');
        return;
    }

    // 分块上传
    for (let i = 0; i < chunkCount; i++) {
        let chunk
        if (i == chunkCount - 1) {
            chunk = file.value.slice(i * chunkSize, file.value.size);
        }
        else {
            chunk = file.value.slice(i * chunkSize, (i + 1) * chunkSize);
        }
        // 计算分块md5
        const chunkMd5 = await calculateFileMD5Chunked(chunk);
        // 构建上传参数
        await uploadFileMultiBlock({
            fileUUID: fileUUIID,
            chunkSize: chunkSize,
            chunkId: i,
            chunkMd5: await calculateFileMD5Chunked(chunk),
            file: chunk
        }).then(resp => {
            if (resp.data.data == true) {
                achieveCount++;
                progress.value = achieveCount / chunkCount * 99;
                console.log(progress.value);

            }
        })
    }

    uploadingMessage.value = '正在校验上传文件完整性...'
    // 校验上传是否正确
    await checkFileUploadIsOk(fileUUIID).then(resp => {
        if (resp.data.data.status) {
            progress.value = 100;
            uploadSuccess.value = true;
            return
        }
        else {
            uploadingMessage.value = '正在重试上传失败块: ';
            reuploadChunk(resp.data.data.failChunksIdList, fileUUIID, chunkCount, fileSize)
        }
    })

    if (uploadSuccess.value) {
        return
    }
    // 第二次校验
    uploadingMessage.value = '正在校验上传文件完整性...'
    // 校验上传是否正确
    await checkFileUploadIsOk(fileUUIID).then(resp => {
        if (resp.data.data.status) {
            progress.value = 100;
            uploadSuccess.value = true;
            return
        }
        else {
            ElMessage.error("网络异常, 请重新上传!")
        }
    })
}
</script>

<style scoped>
.upload-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 24px;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
    font-family: Arial, sans-serif;
}

.title {
    margin-bottom: 20px;
}

.upload-box {
    padding: 40px 20px;
    border: 2px dashed #999;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 20px;
}

.hidden {
    display: none;
}

.actions {
    margin: 20px 0;
}

button {
    padding: 10px 20px;
    font-size: 16px;
}

.progress {
    position: relative;
    height: 20px;
    background: #f3f3f3;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 10px;
}

.bar {
    height: 100%;
    background: #4caf50;
    transition: width 0.3s;
}

.uploading-message {
    color: gray;
    margin-top: 10px;
}

.success {
    color: green;
    margin-top: 10px;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>