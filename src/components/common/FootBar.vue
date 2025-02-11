<template>
<div class="unuse"></div>
<div class="footer-wrap">
    <div class="footer-content">
        <div class="links">
            <a href="#">关于我们</a>
            <span class="divider">|</span>
            <a href="#">使用条款</a>
            <span class="divider">|</span>
            <a href="#">隐私政策</a>
            <span class="divider">|</span>
            <a href="#">联系我们</a>
        </div>
        <div class="copyright">
            Copyright © {{ startYear === currentYear ? currentYear : startYear + ' - ' + currentYear }}
            <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">冀ICP备2023028227号</a>
        </div>
    </div>
</div>
</template>

<script lang='ts' setup>
import { useStore } from '@/stores'

const store = useStore();
const startYear:Number = 2023;
const currentYear:Number = new Date().getFullYear();
</script>

<style scoped lang="less">
.unuse {
    background-color: var(--theme-background);
    height: 40px;
}

.footer-wrap {
    position: relative;
    width: 100%;
    background: #f8f9fa;
    color: #6c757d;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 30px 20px;
        text-align: center;

        .links {
            margin-bottom: 15px;
            
            a {
                color: #6c757d;
                text-decoration: none;
                transition: color 0.2s ease;
                font-size: 14px;
                
                &:hover {
                    color: #007bff;
                }
            }

            .divider {
                margin: 0 10px;
                color: #dee2e6;
            }
        }

        .copyright {
            font-size: 14px;
            color: #adb5bd;
            
            a {
                color: #adb5bd;
                text-decoration: none;
                margin-left: 10px;
                transition: color 0.2s ease;
                
                &:hover {
                    color: #007bff;
                }
            }
        }
    }
}
</style>