<template>
    <div style="display: flex; justify-content: center; gap: 24px; margin-top: 30px;">
        <div class="cover-container" style="width: 420px;">
            <h2 style="width: 100%; text-align: center; align-items: center;">视频封面</h2>
            <div class="cover" @click="selectVideoCoverInput">
                <span v-if="!coverFile">点击或拖拽上传封面图片</span>
                <img v-else :src="coverPreview" alt="封面预览" class="cover-preview">
                <input ref="videoCoverInput" type="file" accept="image/*" class="hidden"
                    @change="onVideoCoverFileChange" />
            </div>
            <div style="width: 100%; margin-left: 20px;" v-if="isShowCoverProgress">
                <el-progress :percentage="coverProgress" :status="coverStatus ? 'success' : ''" />
            </div>
        </div>

        <div class="cover-container" style="width: 420px;">
            <h2 style="width: 100%; text-align: center; align-items: center;">视频文件</h2>
            <div class="cover" @dragover.prevent @drop.prevent="onDrop" @click="selectFile">
                <div>
                    <p v-if="!file">点击或拖拽上传视频文件</p>
                    <p v-else>已选择：{{ file.name }}（{{ formatSize(file.size) }}）</p>
                </div>
                <input ref="fileInput" type="file" accept="video/*" class="hidden" @change="onFileChange" />
            </div>
            <div style="width: 100%; margin-left: 20px; text-align: center;" v-if="isShowvideoProgress">
                <el-progress :percentage="videoProgress" :status="videoStatus ? 'success' : ''" />
                <p v-if="uploadingMessage && !uploadSuccess" class="uploading-message">{{ uploadingMessage }}</p>
                <p v-if="uploadSuccess" class="success">🎉 上传成功！</p>
                <p v-if="error" class="error">❌ 上传失败：{{ error }}</p>
            </div>
        </div>
    </div>

    <!-- 元数据表单 -->
    <div class="metadata" style="display: flex; justify-content: center; gap: 24px; margin-top: 30px;">
        <el-form :model="metadataForm" style="width: 800px" ref="metadataFormRef" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="metadataForm.title" />
            </el-form-item>
            <el-form-item label="类别" prop="categoryId">
                <el-select v-model="metadataForm.categoryId" placeholder="请选择类别" clearable>
                    <el-option v-for="(item,key) in allClass" :label="item.category" :value="item.id" :key="key" />
                </el-select>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <div style="display: flex;">
                    <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false"
                        style="margin-left: 10px;" @close="handleClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" style="margin-left: 10px;"
                        size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                    <el-button v-else class="button-new-tag" size="small" style="margin-left: 10px;" @click="showInput">
                        <span style="font-size: small; font-weight: lighter;">+ New Tag</span>
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="metadataForm.description" type="textarea" :rows="10" maxlength="500"
                    show-word-limit />
            </el-form-item>
            <el-form-item>
                <div style="display: flex; justify-content: center; width: 100%;">
                    <el-button><span style="font-size: small;">取消</span></el-button>
                    <el-button type="primary" @click="startUpload(metadataFormRef)"><span
                            style="font-size: small;">上传</span></el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch, onMounted } from 'vue'
import { calculateFileMD5Chunked } from '@/utils/uploadUtils'
import { ElMessage } from 'element-plus'
import { uploadFileMultiBlock, checkFileUploadIsOk, fileUploadPreHandle, videoCoverUpload } from '@/api/fileApi'
import { MAX_IMAGE_SIZE } from '@/api/config'
import type { InputInstance, FormInstance, FormRules } from 'element-plus'
import type { FileUploadOtherInfo } from '@/api/entity'
import { getAllVideoClass } from '@/api/videoApi'

interface VideoClass{
    id: string,
    category: string
}

const allClass = ref<VideoClass[]>([]);

// 获取全部类别
const getAllClass = () => {
    getAllVideoClass().then((resp) => {
        if (resp.data.status == 200) {
            allClass.value = resp.data.data
        }
    })
}

// 视频文件
const file = ref<File | null>(null)
// 封面文件
const coverFile = ref<File | null>(null)
const coverPreview = ref<string>()
// 封面文件在远程服务器上的路径
const remoteCoverPath = ref<string>()

const fileInput = ref<HTMLInputElement | null>(null)
const videoCoverInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const progress = ref(0)
const uploadSuccess = ref(false)
const error = ref('')
// 上传进度提示
const uploadingMessage = ref('')
// 分块大小
const chunkSize = 5 * 1024 * 1024
// 封面文件上传状态
const isShowCoverProgress = ref(false)
const coverStatus = ref(false)
const coverProgress = ref(0)
// 视频文件上传状态
const isShowvideoProgress = ref(false)
const videoStatus = ref(false)
const videoProgress = ref(0)
const videoUploadedValue = ref(0)

// =================标签逻辑开始===============
const inputValue = ref('')
const dynamicTags = ref<string[]>([])
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()
const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}
const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
}
// ===============标签逻辑结束===============

// 表单规则
// 写一个监视属性，监视dynamicTags，当dynamicTags改变时，将dynamicTags的值赋给tags
watch(dynamicTags.value, (newValue) => {
    metadataForm.tags = newValue[0]
})

interface RuleForm {
    title: string
    tags: string
    description: string
}
const metadataFormRef = ref<FormInstance>()
const rules = reactive<FormRules<RuleForm>>({
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' },
        { min: 2, max: 30, message: '长度应该为2到30个字符', trigger: 'blur' },
    ],
    tags: [
        { required: true, message: '最少输入一个标签', trigger: 'blur' },
    ],
    description: [
        { required: true, message: '请输入视频描述', trigger: 'blur' },
    ],
})

// 点击视频封面上传对话框
const selectVideoCoverInput = () => {
    videoCoverInput.value?.click()
}

// 元数据表单
const metadataForm = reactive({
    title: '',
    description: '',
    tags: "",
    categoryId: ""
})

// 选择视频封面文件 并上传到后端服务器 返回服务器路径
const onVideoCoverFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files?.length) {
        coverFile.value = target.files[0]
        coverPreview.value = URL.createObjectURL(coverFile.value!)
    }

    // 判断大小是否超过最大大小
    if (coverFile.value!.size > MAX_IMAGE_SIZE) {
        ElMessage.error('文件大小超过最大限制')
        return;
    }

    isShowCoverProgress.value = true;
    // 重置上传进度
    coverProgress.value = 0;
    coverStatus.value = false;

    // 计算封面的md5码
    const md5 = await calculateFileMD5Chunked(coverFile.value!)
    videoCoverUpload(coverFile.value!, md5, {
        onUploadProgress: (progressEvent: ProgressEvent) => {
            if (progressEvent.total) {
                coverProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            }
        }
    }).then((resp) => {
        if (resp.data.status == 200) {
            remoteCoverPath.value = resp.data.data
            coverStatus.value = true;
        }
        else {
            ElMessage.error("封面上传失败");
        }
    })
}

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
async function startUpload(formEl: FormInstance | undefined) {
    videoStatus.value = false;
    if (!file.value) {
        ElMessage.error("请选择视频文件")
        return;
    }

    let canSubmit = false;

    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            canSubmit = true
        } else {
            ElMessage.error("请检查填写项")
        }
    })

    if (!canSubmit) return
    if (coverStatus.value == false) {
        ElMessage.warning("请等待封面上传完毕后点击提交按钮")
        return;
    }

    // 计算文件的md5码
    const md5 = await calculateFileMD5Chunked(file.value)
    // 文件大小
    const fileSize = file.value.size
    // 文件的uuid
    let fileUUIID: string = '', chunkCount = 0, achieveCount = 0;

    // 构建视频文件的其他元数据信息
    const otherInfo: FileUploadOtherInfo = {
        taskType: 'video',
        videoMetadata: {
            title: metadataForm.title,
            description: metadataForm.description,
            tags: dynamicTags.value,
            coverUrl: remoteCoverPath.value!,
            categoryId: metadataForm.categoryId
        }
    }
    uploading.value = true

    isShowvideoProgress.value = true

    // 分块上传预处理
    const preUploadForm = new FormData()
    preUploadForm.append('filename', file.value.name)
    preUploadForm.append('fileSize', fileSize.toString())
    preUploadForm.append('md5', md5)
    await fileUploadPreHandle(file.value.name, fileSize, md5, otherInfo).then((resp) => {
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

    let chunksUploaded = new Array(chunkCount).fill(0.0);

    // 分块上传
    for (let i = 0; i < chunkCount; i++) {
        let chunk;
        if (i == chunkCount - 1) {
            chunk = file.value.slice(i * chunkSize, file.value.size);
        }
        else {
            chunk = file.value.slice(i * chunkSize, (i + 1) * chunkSize);
        }
        // 计算分块md5
        const chunkMd5 = await calculateFileMD5Chunked(chunk);
        // 构建上传参数
        uploadFileMultiBlock({
            fileUUID: fileUUIID,
            chunkSize: chunkSize,
            chunkId: i,
            chunkMd5: await calculateFileMD5Chunked(chunk),
            file: chunk
        }, {
            onUploadProgress: (progressEvent: ProgressEvent) => {
                if (progressEvent.total) {
                    chunksUploaded[i] = (progressEvent.loaded / progressEvent.total) * chunk.size;
                    videoProgress.value = parseFloat(((chunksUploaded.reduce((a, b) => a + b, 0) / fileSize) * 100).toFixed(2));
                }
            }
        }).then(resp => {
            if (resp.data.data == true) {
                achieveCount++;
            }
        })
    }

    while (achieveCount < chunkCount) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    uploadingMessage.value = '正在校验上传文件完整性...'
    // 校验上传是否正确
    await checkFileUploadIsOk(fileUUIID).then(resp => {
        if (resp.data.data.status) {
            videoProgress.value = 100;
            videoStatus.value = true;
            uploadSuccess.value = true;
            return
        }
        else {
            uploadingMessage.value = '正在重试上传失败块: ';
            error.value = resp.data.data.data;
            reuploadChunk(resp.data.data.failChunksIdList, fileUUIID, chunkCount, fileSize)
        }
    })

    if (videoStatus.value) {
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

onMounted(() => {
    getAllClass();
});

</script>

<style scoped>
.cover {
    max-width: 500px;
    height: 260px;
    margin: 10px auto;
    border: 2px dashed #999;
    border-radius: 8px;
    text-align: center;
    font-family: Arial, sans-serif;
    align-items: center;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.cover-preview {
    width: 100%;
    height: 100%;
}

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