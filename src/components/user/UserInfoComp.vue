<template>
    <HeaderCoverComp></HeaderCoverComp>
    <div class="container">
        <div class="user-info-container">
            <el-card class="user-card">
                <div class="card-header">
                    <h2>个人信息</h2>
                    <p>管理您的个人资料信息</p>
                </div>

                <div class="avatar-section">
                    <div class="avatar-wrapper">
                        <el-upload class="avatar-uploader" action="/api/upload/avatar" :show-file-list="false"
                            :on-success="handleAvatarSuccess" :auto-upload="true">
                            <div class="avatar-preview">
                                <img v-if="form.avatar" :src="form.avatar" class="avatar-image" />
                                <div v-else class="avatar-placeholder">
                                    <el-avatar shape="square" :size="100" fit="fill" :src="pinia.currentUser?.avatar" />
                                </div>
                            </div>
                        </el-upload>
                    </div>
                </div>

                <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="left"
                    class="user-form">
                    <el-row :gutter="24">
                        <el-col :span="24">
                            <el-form-item label="昵称" prop="nickname">
                                <el-input v-model="form.nickname" placeholder="请输入您的昵称" size="large" clearable />
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="性别" prop="gender">
                                <el-select v-model="form.gender" placeholder="请选择性别" size="large" style="width: 100%">
                                    <el-option label="男" value="男" />
                                    <el-option label="女" value="女" />
                                    <el-option label="保密" value="保密" />
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="生日" prop="birthday">
                                <el-date-picker v-model="form.birthday" type="date" placeholder="请选择您的生日"
                                    format="YYYY年MM月DD日" value-format="YYYY-MM-DD" size="large" style="width: 100%" />
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="手机号" prop="phone">
                                <el-input v-model="form.phone" placeholder="请输入您的手机号" size="large" clearable />
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="form.email" placeholder="请输入您的邮箱" size="large" clearable disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <div class="form-actions">
                        <el-button @click="handleCancel" size="large">返回</el-button>
                        <el-button type="primary" @click="handleSubmit" size="large" :loading="submitting">
                            保存信息
                        </el-button>
                    </div>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { User, Camera } from "@element-plus/icons-vue";
import type { FormInstance } from 'element-plus';
import HeaderCoverComp from "../common/HeaderCoverComp.vue";

import { useStore } from "@/stores";
import { updateUserInfoById } from "@/api/userRequest";
import router from "@/router";

const pinia = useStore();

const formRef = ref<FormInstance>();
const submitting = ref(false);

const form = reactive({
    avatar: pinia.currentUser?.avatar,
    nickname: pinia.currentUser?.nickname,
    gender: pinia.currentUser?.gender,
    birthday: pinia.currentUser?.birthday,
    email: pinia.currentUser?.email,
    phone: pinia.currentUser?.phone
});

const rules = {
    nickname: [
        { required: true, message: "请输入昵称", trigger: "blur" },
        { min: 2, max: 20, message: "昵称长度应在 2-20 个字符之间", trigger: "blur" }
    ]
};

const handleAvatarSuccess = (response: any) => {
    if (response && response.url) {
        form.avatar = response.url;
        ElMessage.success("头像上传成功");
    } else {
        ElMessage.error("头像上传失败");
    }
};

const handleSubmit = async () => {
    if (!formRef.value) return;
    updateUserInfoById(pinia.currentUser?.id, form.nickname, form.avatar, form.gender, form.birthday, form.phone)
    .then((resp) => { 
        if (resp.data.status == 200) {
            ElMessage.success(`更新成功`)
            pinia.currentUser = resp.data.data;
        }
    })
};

const handleCancel = () => {
    ElMessageBox.confirm(
        '确定要取消编辑吗？未保存的更改将会丢失',
        '确认取消',
        {
            confirmButtonText: '确定',
            cancelButtonText: '继续编辑',
            type: 'warning',
        }
    ).then(() => {
        router.push("/home")
    }).catch(() => {
        // 用户点击了取消按钮
    });
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    padding: 20px;
    height: 100vh;
    background-color: #f5f7fa;
}

.user-info-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    min-height: auto;
    background-color: #f5f7fa;
}

.user-card {
    margin-top: 90px;
    max-height: 700px;
    width: 100%;
    max-width: 800px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
    text-align: center;
    padding: 20px 0 20px;
}

.card-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
}

.card-header p {
    margin: 8px 0 0;
    color: #909399;
    font-size: 14px;
}

.avatar-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.avatar-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
}

.avatar-uploader {
    width: 100%;
    height: 100%;
}

.avatar-preview {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #ebeef5;
    transition: all 0.3s;
    margin: 0 auto;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f2f6fc;
    color: #c0c4cc;
}

.avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity 0.3s;
    cursor: pointer;
}

.avatar-overlay span {
    margin-top: 6px;
    font-size: 12px;
}

.avatar-wrapper:hover .avatar-overlay {
    opacity: 1;
}

.user-form {
    padding: 0 30px 20px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
}

:deep(.el-form-item) {
    margin-bottom: 18px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
}

@media (max-width: 768px) {
    .user-info-container {
        padding: 10px;
    }

    .user-card {
        border-radius: 8px;
    }

    .user-form {
        padding: 0 20px 15px;
    }

    .avatar-wrapper {
        width: 80px;
        height: 80px;
    }
}
</style>