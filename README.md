# MemorialModule
Mini program project-Memorial module
# 拥抱妈妈·爱在平安 - 微信小程序项目

## 项目概述

这是一款以"AI向善"为核心理念的公益小程序，通过虚拟拥抱、老照片修复、纪念空间等功能连接亲情。

## 技术栈

- **框架**: 微信小程序原生 + TypeScript
- **UI**: Vant WeUI
- **3D/动画**: Three.js (three-platformize 小程序适配版)
- **网络**: 自定义 HTTP 请求封装（适配 Java SpringBoot 后端）
- **状态管理**: 小程序原生

## 项目结构

```
MiniProgram/
├── components/           # 组件库
│   └── HeartParticles/  # 情感粒子组件
├── pages/               # 页面
│   ├── hug/            # 虚拟拥抱页
│   └── memorial/       # 纪念空间页
├── utils/              # 工具函数
│   ├── request.ts      # HTTP 请求封装
│   ├── vibration.ts    # 震动反馈工具
│   ├── config.ts       # 环境配置
│   └── three-helper.ts # Three.js 资源清理工具
├── types/              # TypeScript 类型定义
│   └── index.ts        # 数据模型定义
└── app.ts              # 小程序入口
```

## 核心功能

### 1. 虚拟拥抱 (pages/hug)

- 长按按钮触发拥抱交互
- 震动反馈模拟拥抱节奏（轻→重→轻）
- 粒子特效增强情感表达
- 自动适配纪念模式

### 2. 纪念空间 (pages/memorial)

- 伦理设计：已故家人自动进入纪念模式
- 禁用娱乐化功能（AR、动态特效）
- 静默缅怀氛围设计
- 蜡烛纪念、留言功能

### 3. 情感粒子组件 (HeartParticles)

- Three.js 实现爱心飘落效果
- 支持纪念模式切换
- 完整的资源清理机制（防止内存泄漏）
- 性能优化（低端机友好）

## 伦理设计

所有功能遵循以下伦理原则：

1. **尊重逝者**: 已故家人的照片禁止AI处理，保持原貌
2. **用户授权**: 所有AI功能需用户显式授权
3. **纪念模式**: 纪念模式下禁用娱乐化功能
4. **数据保护**: 返回数据设置过期时间
5. **操作可追溯**: 记录伦理日志

## 安装与运行

### 1. 安装依赖
```bash
npm install
```

如果 npm 安装失败，使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

### 2. 启动项目

使用微信开发者工具打开 `MiniProgram` 目录

### 3. 构建 npm

点击菜单「工具」→「构建 npm」

### 4. 配置环境

修改 `utils/config.ts` 中的环境配置：
```typescript
const DEV_CONFIG: EnvConfig = {
  baseURL: 'https://your-dev-api.com',
  // ...
};
```

## 网络请求封装

`utils/request.ts` 提供了适配 Java SpringBoot 后端的 HTTP 请求封装：

- 自动携带 Token
- 统一错误处理
- 401 自动跳转登录
- 支持 GET/POST/PUT/DELETE/UPLOAD

```typescript
import { get, post } from '../utils/request';

// GET 请求
const res = await get<FamilyMemberVO[]>('/api/family/list');

// POST 请求
const result = await post<HugResponse>('/api/hug/send', {
  targetMemberId: 'xxx',
  hugType: 'virtual',
  memorialMode: false,
});
```

## 后端对接

### Java 后端统一响应格式

```java
public class ApiResponse<T> {
    private int code;
    private String msg;
    private T data;
    private boolean success;
    private long timestamp;
}
```

### 接口示例

```
POST /api/hug/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "targetMemberId": "string",
  "hugType": "virtual",
  "memorialMode": false
}
```

## License

MIT
