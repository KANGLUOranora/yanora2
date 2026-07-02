# YANORA 项目开发文档

更新时间：2026-06-29

## 1. 项目概览

YANORA 是一个基于 Vite + React + TypeScript 的医美咨询与预约网站。前台包含首页、项目页、医院页、案例页、FAQ、预约与支付流程；后台包含预约、案例、FAQ、客户评价、访问统计、访客行为、管理员等管理模块。

项目核心目标：

- 展示 YANORA 的面部分析、项目服务、医院网络、案例与品牌方法论。
- 支持用户注册登录、上传面部照片、提交预约、进入支付流程。
- 支持管理员查看预约、管理案例、FAQ、客户评价、访问数据。
- 通过 Supabase 提供认证、数据库、存储、Edge Functions 与 RLS 权限控制。

## 2. 技术栈

- 前端框架：React 18
- 构建工具：Vite 5
- 语言：TypeScript
- 路由：react-router-dom 7
- 样式：Tailwind CSS + `src/index.css` 自定义样式
- 图标：lucide-react
- 后端服务：Supabase
- 支付：PayPal Edge Functions / 本地 server 兼容实现
- 部署：Netlify

## 3. 本地开发

### 安装依赖

```bash
npm install
```

Windows PowerShell 如果遇到 `npm.ps1` 执行策略问题，使用：

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
```

### 启动项目

```bash
npm run dev
```

推荐在本机调试时使用：

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev -- --host 0.0.0.0
```

默认访问地址：

```text
http://localhost:5173/
```

### 构建

```bash
npm run build
```

### 预览构建产物

```bash
npm run preview
```

### 类型检查

```bash
npm run typecheck
```

当前项目中存在一些历史遗留的 TypeScript 警告/错误，例如未使用变量、旧接口字段不匹配等。开发新功能时应优先保证新增代码不引入新的构建错误，后续可单独安排类型清理。

## 4. 环境变量

前端 Supabase 客户端位于：

```text
src/lib/supabase.ts
```

需要配置：

```env
VITE_SUPABASE_URL=你的 Supabase Project URL
VITE_SUPABASE_ANON_KEY=你的 Supabase anon public key
```

如果缺失，代码会使用 placeholder 并在控制台输出警告，但真实登录、预约、后台和数据读取功能不可用。

PayPal / 邮件 / 管理员创建等 Edge Functions 还需要在 Supabase Functions 环境中配置相关密钥，例如：

```env
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

实际名称以 `supabase/functions/*/index.ts` 中读取的环境变量为准。

## 5. 项目结构

```text
src/
  main.tsx                         # 应用入口、路由注册
  App.tsx                          # 首页
  index.css                        # 全站样式与页面专属样式
  lib/
    supabase.ts                    # Supabase 客户端
  contexts/
    AuthContext.tsx                # 用户认证上下文
    LanguageContext.tsx            # 中英文文案与 t() 翻译方法
    AnalyticsContext.tsx           # 页面访问统计
    VisitorTrackingContext.tsx     # 访客行为追踪
  components/
    Navbar.tsx                     # 内页通用导航
    Footer.tsx                     # 页脚
    BookingPage.tsx                # 预约流程容器
    booking/
      BookingDesktop.tsx           # 桌面端预约 UI
      BookingMobile.tsx            # 移动端预约 UI
    PaymentPage.tsx                # 支付页
    AdminDashboard.tsx             # 后台主界面
    HospitalPage.tsx               # 医院页面
    FacialContourPage.tsx          # 面部轮廓页
    BodySculptingPage.tsx          # 身体塑形页
    InjectionLiftingPage.tsx       # 注射/提升页
    HairTransplantPage.tsx         # 植发页
    DentalPage.tsx                 # 牙科页
    CasesPage.tsx                  # 案例页
    FAQPage.tsx                    # FAQ 页

supabase/
  config.toml                      # Supabase 项目与函数配置
  migrations/                      # 数据库迁移
  functions/                       # Edge Functions

server/
  index.ts / index.js              # PayPal 本地服务兼容实现

public/
  *.png / *.jpg / *.svg            # 页面图片与静态资源
```

## 6. 路由说明

主要路由在 `src/main.tsx` 注册：

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | `App` | 首页 |
| `/hospitals` | `HospitalPage` | 医院板块 |
| `/booking` | `BookingPage` | 预约与面部照片上传 |
| `/payment` | `PaymentPage` | 支付 |
| `/booking/success` | `BookingSuccessPage` | 预约成功 |
| `/login` | `LoginPage` | 用户登录 |
| `/register` | `RegisterPage` | 用户注册 |
| `/admin/login` | `AdminLoginPage` | 管理员登录 |
| `/admin` | `AdminDashboard` | 后台管理 |
| `/facial-contour` | `FacialContourPage` | 面部轮廓项目 |
| `/body-sculpting` | `BodySculptingPage` | 身体塑形项目 |
| `/injection-lifting` | `InjectionLiftingPage` | 面部年轻化/注射提升 |
| `/hair-transplant` | `HairTransplantPage` | 植发 |
| `/dental` | `DentalPage` | 牙科 |
| `/cases` | `CasesPage` | 案例 |
| `/faq` | `FAQPage` | FAQ |
| `/privacy-policy` | `PrivacyPolicyPage` | 隐私政策 |
| `/after-sales` | `AfterSalesPage` | 售后支持 |

## 7. 导航系统

首页导航写在 `src/App.tsx`，其它页面使用 `src/components/Navbar.tsx`。

目前导航包含：

- 首页
- 项目
- 医院
- 案例
- FAQ
- 登录 / 用户头像
- 立即预约

新增导航项时需要同步两个地方：

1. 首页：`src/App.tsx`
2. 内页：`src/components/Navbar.tsx`

如果需要中英文文案，还要同步：

```text
src/contexts/LanguageContext.tsx
```

## 8. 首页功能

首页主要位于 `src/App.tsx`，包括：

- 首屏品牌表达
- 面部优先级/问题识别内容
- 项目入口
- 面部照片上传入口
- 登录/注册提示弹窗
- 移动端菜单
- 语言切换

### 首页三张面部照片上传

当前首页支持三张固定角度照片：

- 正面
- 左 45°
- 右 45°

逻辑要点：

- 未登录用户点击上传或提交时，会弹出登录/注册提示。
- 已登录用户可选择照片。
- 选择后首页卡片显示本地预览。
- 三张照片齐全后可提交并跳转 `/booking`。
- 文件通过 `navigate('/booking', { state: { facePhotos } })` 传递给预约页。

## 9. 预约流程

预约模块主要文件：

```text
src/components/BookingPage.tsx
src/components/booking/BookingDesktop.tsx
src/components/booking/BookingMobile.tsx
```

流程：

1. 上传三张面部照片。
2. 选择分析/咨询服务。
3. 填写联系信息。
4. 提交预约数据到 Supabase `bookings`。
5. 上传照片到 Supabase Storage `booking-face-photos`。
6. 跳转 `/payment?booking_id=...`。

关键字段：

- `facePhotos`: 前端 File 数组
- `facePhotoPreviews`: 本地 object URL 预览
- `face_photo_urls`: 写入 `bookings` 的照片路径数组
- `selected_services`: 已选择服务 JSON
- `consultation_fee` / `total_amount`: 费用

相关迁移：

```text
supabase/migrations/20260621193000_add_booking_face_photos.sql
```

该迁移会：

- 给 `bookings` 增加 `face_photo_urls jsonb`
- 创建私有 bucket：`booking-face-photos`
- 配置用户/管理员读取和更新权限

## 10. 支付流程

支付页：

```text
src/components/PaymentPage.tsx
```

主要逻辑：

- 根据 URL 参数 `booking_id` 查询预约信息。
- 检查 PayPal SDK 是否加载。
- 调用 Supabase Edge Functions：
  - `create-paypal-order`
  - `capture-paypal-order`
  - `send-booking-confirmation`
- 支付成功后更新 `bookings.payment_status`，插入 `payments` 记录，跳转成功页。

Edge Functions：

```text
supabase/functions/create-paypal-order/
supabase/functions/capture-paypal-order/
supabase/functions/send-booking-confirmation/
supabase/functions/create-stripe-payment/
```

Supabase 函数配置：

```text
supabase/config.toml
```

## 11. 后台管理

入口：

```text
/admin/login
/admin
```

主要文件：

```text
src/components/AdminLoginPage.tsx
src/components/AdminDashboard.tsx
```

后台模块：

- 访问统计：`AnalyticsManagement`
- 访客行为：`VisitorAnalyticsManagement`
- 预约管理：`BookingManagement`
- 简单案例：`CaseStudyManagement`
- 完整案例：`DetailedCaseManagement`
- 详细案例对比：`DetailedCaseComparisonManagement`
- 客户管理：`CustomerManagement`
- FAQ 管理：`FAQManagement`
- 客户评价：`TestimonialManagement`
- 管理员管理：`AdminManagement`

管理员权限依赖 Supabase `admins` 表。`super_admin` 可访问管理员管理模块。

相关文档：

```text
ADMIN_SETUP_GUIDE.md
CREATE_SUPER_ADMIN.md
CREATE_SUPER_ADMIN_INSTRUCTIONS.md
```

## 12. 医院页面

医院页：

```text
src/components/HospitalPage.tsx
```

路由：

```text
/hospitals
```

页面结构：

1. 哲学引语
2. 多医生专项体系
3. 上海医疗网络
4. 医院卡片
5. 医学美学论坛
6. 重点学术活动
7. 学术交流声明
8. 全球合作地图
9. 国际服务流程
10. 数据背书

样式集中在：

```text
src/index.css
```

类名前缀：

```text
yanora-hospital-
```

## 13. 多语言系统

翻译文件：

```text
src/contexts/LanguageContext.tsx
```

使用方式：

```tsx
const { t, language } = useLanguage();

t('nav.home')
t.nav.home
```

注意：

- 当前中文文案文件里存在历史编码乱码，新增文案时建议使用 UTF-8 保存。
- 新增导航或页面公共文案时，需要同时补中文和英文。
- 有些页面仍使用硬编码中文/英文，后续可逐步迁移到 `LanguageContext`。

## 14. Supabase 数据模块

项目使用 Supabase 提供：

- Auth：用户登录注册
- Database：预约、支付、案例、FAQ、管理员、统计等
- Storage：头像、案例图片、评价图片、预约面部照片
- Edge Functions：PayPal、邮件、超级管理员创建等

重要表/模块：

- `profiles`
- `admins`
- `bookings`
- `payments`
- `case_studies`
- `detailed_cases`
- `detailed_case_comparisons`
- `faqs`
- `testimonials`
- `page_analytics`
- `visitor_sessions`
- `visitor_page_views`
- `visitor_actions`

迁移文件位于：

```text
supabase/migrations/
```

完整数据库搭建可参考：

```text
DATABASE_SETUP_GUIDE.md
setup-database.sql
```

## 15. 访问统计与访客追踪

上下文：

```text
src/contexts/AnalyticsContext.tsx
src/contexts/VisitorTrackingContext.tsx
```

功能：

- 页面浏览记录
- 匿名 visitor id
- 会话记录
- 页面停留时长
- 访客行为记录

相关表：

- `page_analytics`
- `visitor_sessions`
- `visitor_page_views`
- `visitor_actions`

相关迁移：

```text
supabase/migrations/20260320054756_create_page_analytics_table.sql
supabase/migrations/20260323085208_create_visitor_tracking_system.sql
supabase/migrations/20260323085256_create_visitor_tracking_functions.sql
```

## 16. 静态资源

静态资源放在：

```text
public/
```

使用方式：

```tsx
<img src="/yanora-desktop-hero-aesthetic.png" />
```

注意：

- Vite 中 `public` 目录资源以站点根路径引用。
- 大图较多，新增图片前建议压缩。
- 页面中如果展示真实医院/医生/患者信息，需要确认授权与合规。

## 17. 部署

Netlify 配置：

```text
netlify.toml
```

当前配置：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

SPA 路由依赖 Netlify redirect，否则刷新 `/booking`、`/hospitals` 等子路由可能 404。

部署前检查：

```bash
npm run build
```

并确认 Netlify 环境变量已配置：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Supabase Edge Functions 需要单独部署并配置 secrets。

## 18. 常见开发任务

### 新增页面

1. 在 `src/components/` 新建页面组件。
2. 在 `src/main.tsx` 添加 `Route`。
3. 如需导航入口，同步 `App.tsx` 和 `Navbar.tsx`。
4. 如需多语言，同步 `LanguageContext.tsx`。
5. 样式建议使用独立前缀，避免污染全局。

### 新增后台模块

1. 新建管理组件。
2. 在 `AdminDashboard.tsx` 扩展 `TabType`。
3. 添加侧边栏按钮。
4. 添加内容区域条件渲染。
5. 如需数据库，新增 Supabase migration。

### 新增 Supabase 表

1. 在 `supabase/migrations/` 新增迁移。
2. 开启 RLS。
3. 配置 public/authenticated/admin 权限。
4. 前端用 `src/lib/supabase.ts` 客户端访问。
5. 后台高权限操作使用 Edge Function + service role。

### 新增图片上传

1. 创建 Storage bucket。
2. 配置 `storage.objects` RLS policy。
3. 前端选择文件后先展示 object URL 预览。
4. 表单提交后上传到 Storage。
5. 数据库只保存路径或 public URL。

## 19. 已知注意事项

- PowerShell 下 `npm` 可能因执行策略失败，使用 `npm.cmd`。
- `npm run typecheck` 目前会暴露历史类型问题，不代表新增功能一定不可构建。
- 某些中文文案存在乱码，后续整理时建议统一 UTF-8。
- 项目里有一些历史 SQL 和重复迁移，生产数据库应以 Supabase 当前线上状态为准，谨慎重复执行旧迁移。
- PayPal 有两套实现：Supabase Edge Functions 和 `server/` 本地 Express 兼容实现，部署时优先使用 Edge Functions。
- 预约照片 bucket 是私有的，后台或用户查看照片要满足 RLS policy。

## 20. 推荐交接检查清单

- [ ] `.env` 已配置 Supabase 前端变量。
- [ ] Supabase migrations 已应用到目标项目。
- [ ] `booking-face-photos` bucket 存在且为 private。
- [ ] PayPal Edge Functions 已部署并配置 secrets。
- [ ] `admins` 表已有至少一个 active 管理员。
- [ ] `npm run build` 通过。
- [ ] Netlify 环境变量已配置。
- [ ] Netlify SPA redirect 生效。
- [ ] 首页上传照片、预约、支付、后台查看流程已完成一次端到端测试。

