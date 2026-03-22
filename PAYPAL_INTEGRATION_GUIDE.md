# PayPal支付集成完整指南

## 已完成的步骤

### ✅ 1. 前端配置
- 在 `index.html` 中添加了PayPal SDK脚本
- 更新了 `PaymentPage.tsx` 组件，集成了真实的PayPal支付按钮
- 移除了卡支付选项，只保留PayPal

### ✅ 2. 后端函数
- `supabase/functions/create-paypal-order/index.ts` - 创建PayPal订单
- `supabase/functions/capture-paypal-order/index.ts` - 捕获/完成支付

### ✅ 3. 环境变量


## 需要完成的步骤

### ⏳ 1. 在Supabase中配置环境变量

1. 登录 https://app.supabase.com/
2. 选择你的项目
3. 进入 **Settings** → **Edge Functions**
4. 在 "Environment variables" 部分，添加：
   - **PAYPAL_CLIENT_ID**: `AX7u87tgzrtr5eX-3EaNPeg0aggC7Jw3bvFrS8UvFOYwYFAHFBj4F05312RYIKfv3yEvm4R6f9hFeg9T`
   - **PAYPAL_CLIENT_SECRET**: `ECZwxyNUG9FEPHTNC0_Zr-QmRZltWKYIT6_gwtVfawqPM1cUQuLED4Vg9k8vXkEX_3q6ScM2UtgXfrNz`

### ⏳ 2. 部署Edge Functions

在项目根目录运行：

```bash
# 首先确保已登录Supabase
supabase login

# 部署PayPal函数
supabase functions deploy create-paypal-order
supabase functions deploy capture-paypal-order
```

### ⏳ 3. 测试支付流程

1. 启动开发服务器：`npm run dev`
2. 进行预约并进入支付页面
3. 选择服务并点击PayPal按钮
4. 使用PayPal沙箱测试账户完成支付

## PayPal沙箱测试账户

在PayPal开发者平台中，你可以找到测试账户：
- **Business Account**: 用于接收支付
- **Personal Account**: 用于测试支付

## 支付流程说明

1. 用户选择服务并点击PayPal按钮
2. 前端调用 `create-paypal-order` 函数创建订单
3. PayPal返回订单ID
4. 用户在PayPal页面完成支付
5. 支付完成后，调用 `capture-paypal-order` 函数
6. 后端更新数据库中的预订状态
7. 发送确认邮件
8. 重定向到成功页面

## 文件修改清单

- ✅ `index.html` - 添加PayPal SDK
- ✅ `src/components/PaymentPage.tsx` - 集成PayPal支付
- ✅ `supabase/functions/create-paypal-order/index.ts` - 已存在
- ✅ `supabase/functions/capture-paypal-order/index.ts` - 已存在
- ✅ `supabase.json` - 创建配置文件

## 常见问题

### Q: 如何切换到生产环境？
A: 在PayPal开发者平台中，将API基础URL从 `https://api-m.paypal.com` 改为 `https://api.paypal.com`，并使用生产环境的凭证。

### Q: 支付失败怎么办？
A: 检查浏览器控制台的错误信息，确保：
1. PayPal SDK已正确加载
2. Supabase环境变量已配置
3. Edge Functions已部署
4. 网络连接正常

### Q: 如何查看支付记录？
A: 在Supabase中查看 `payments` 表和 `bookings` 表的 `payment_status` 字段。

