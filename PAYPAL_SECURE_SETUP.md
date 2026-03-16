# PayPal安全支付集成指南

## 架构说明

```
前端 (React)
    ↓
后端API (Node.js/Express) ← PayPal凭证安全存储
    ↓
PayPal API
```

**安全特点：**
- ✅ PayPal Secret Key只存储在后端服务器
- ✅ 前端无法访问敏感凭证
- ✅ 所有支付验证在后端进行
- ✅ 防止支付欺骗

---

## 快速开始

### 第一步：安装后端依赖

在 `server` 目录中运行：

```bash
cd server
npm install
```

### 第二步：配置环境变量

在 `server/.env` 文件中添加（如果文件不存在，手动创建）：

```
PAYPAL_CLIENT_ID=AX7u87tgzrtr5eX-3EaNPeg0aggC7Jw3bvFrS8UvFOYwYFAHFBj4F05312RYIKfv3yEvm4R6f9hFeg9T
PAYPAL_CLIENT_SECRET=ECZwxyNUG9FEPHTNC0_Zr-QmRZltWKYIT6_gwtVfawqPM1cUQuLED4Vg9k8vXkEX_3q6ScM2UtgXfrNz
PORT=3001
```

### 第三步：启动后端服务器

在 `server` 目录中运行：

```bash
npm run dev
```

你应该看到：
```
Server running on http://localhost:3001
```

### 第四步：启动前端开发服务器

在项目根目录打开新的终端，运行：

```bash
npm run dev
```

---

## 支付流程

1. **用户选择服务** → 点击PayPal按钮
2. **前端调用后端** → `POST /api/paypal/create-order`
3. **后端与PayPal通信** → 使用Secret Key创建订单
4. **返回订单ID** → 前端显示PayPal支付界面
5. **用户完成支付** → PayPal返回支付结果
6. **前端调用后端** → `POST /api/paypal/capture-order`
7. **后端验证支付** → 更新数据库
8. **显示成功页面** → 重定向到预约成功页面

---

## 文件结构

```
yanora-main/
├── server/
│   ├── index.ts              # 后端API服务器
│   ├── package.json          # 后端依赖
│   └── .env                  # 环境变量（不提交到Git）
├── src/
│   ├── components/
│   │   └── PaymentPage.tsx   # 前端支付页面
│   └── ...
└── ...
```

---

## API端点

### 创建订单
```
POST /api/paypal/create-order

请求体：
{
  "amount": 100,
  "currency": "USD",
  "bookingId": "booking-123"
}

响应：
{
  "orderId": "paypal-order-id"
}
```

### 捕获订单
```
POST /api/paypal/capture-order

请求体：
{
  "orderId": "paypal-order-id"
}

响应：
{
  "success": true,
  "data": { ... PayPal响应数据 ... }
}
```

---

## 测试支付

1. 启动后端服务器：`npm run dev` (在 `server` 目录)
2. 启动前端服务器：`npm run dev` (在项目根目录)
3. 进行预约并进入支付页面
4. 选择服务并点击PayPal按钮
5. 使用PayPal沙箱账户完成支付

---

## 生产环境部署

### 后端部署选项

1. **Vercel** (推荐)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Railway**
   - 连接GitHub仓库
   - 设置环境变量
   - 自动部署

3. **Heroku**
   ```bash
   heroku create your-app-name
   heroku config:set PAYPAL_CLIENT_ID=...
   heroku config:set PAYPAL_CLIENT_SECRET=...
   git push heroku main
   ```

### 更新前端API地址

部署后，更新 `PaymentPage.tsx` 中的API地址：

```typescript
// 开发环境
const API_URL = 'http://localhost:3001';

// 生产环境
const API_URL = 'https://your-backend-domain.com';
```

---

## 常见问题

### Q: 为什么需要后端？
A: 为了安全。PayPal Secret Key不能暴露在前端代码中。

### Q: 支付失败怎么办？
A: 检查：
1. 后端服务器是否运行
2. PayPal凭证是否正确
3. 网络连接是否正常
4. 浏览器控制台的错误信息

### Q: 如何从沙箱切换到生产环境？
A: 
1. 在PayPal Dashboard中获取生产环境凭证
2. 更新 `.env` 文件中的凭证
3. 将 `PAYPAL_API_BASE` 从 `https://api-m.paypal.com` 改为 `https://api.paypal.com`

---

## 安全建议

✅ **已实现：**
- 凭证存储在后端
- 支付验证在后端进行
- CORS配置

⚠️ **生产环境还需要：**
- HTTPS加密
- 请求签名验证
- 速率限制
- 日志记录
- 错误监控


