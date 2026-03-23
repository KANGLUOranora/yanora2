# 访客追踪系统 - SQL 查询指南

本文档包含可以在 Supabase SQL Editor 中直接运行的查询语句，用于查看和分析访客数据。

## 📊 基础统计查询

### 1. 查看总体访问统计
```sql
SELECT
  COUNT(*) as 总访问次数,
  COUNT(DISTINCT visitor_id) as 独立访客数,
  COUNT(*) FILTER (WHERE session_end IS NULL) as 当前在线人数,
  ROUND(AVG(total_duration_seconds)) as 平均停留时长秒,
  SUM(total_page_views) as 总页面浏览数
FROM visitor_sessions;
```

### 2. 今日访问统计
```sql
SELECT
  COUNT(*) as 今日访问次数,
  COUNT(DISTINCT visitor_id) as 今日独立访客,
  ROUND(AVG(total_duration_seconds)) as 平均停留时长秒,
  SUM(total_page_views) as 今日页面浏览数
FROM visitor_sessions
WHERE session_start >= CURRENT_DATE;
```

### 3. 设备类型分布
```sql
SELECT
  device_type as 设备类型,
  COUNT(*) as 访问次数,
  ROUND(AVG(total_duration_seconds)) as 平均停留时长秒,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as 占比百分比
FROM visitor_sessions
GROUP BY device_type
ORDER BY 访问次数 DESC;
```

### 4. 浏览器分布
```sql
SELECT
  browser as 浏览器,
  COUNT(*) as 访问次数,
  ROUND(AVG(total_duration_seconds)) as 平均停留时长秒
FROM visitor_sessions
WHERE browser IS NOT NULL
GROUP BY browser
ORDER BY 访问次数 DESC;
```

## 🌍 访客来源分析

### 5. 着陆页统计（最受欢迎的入口页面）
```sql
SELECT
  landing_page as 着陆页,
  COUNT(*) as 访问次数,
  ROUND(AVG(total_duration_seconds)) as 平均停留时长秒,
  ROUND(AVG(total_page_views), 2) as 平均浏览页数
FROM visitor_sessions
GROUP BY landing_page
ORDER BY 访问次数 DESC
LIMIT 20;
```

### 6. 最受欢迎的页面（按浏览次数）
```sql
SELECT
  page_path as 页面路径,
  COUNT(*) as 浏览次数,
  ROUND(AVG(duration_seconds)) as 平均停留时长秒,
  ROUND(AVG(scroll_depth_percent)) as 平均滚动深度百分比
FROM page_views
GROUP BY page_path
ORDER BY 浏览次数 DESC
LIMIT 20;
```

### 7. 引荐来源统计
```sql
SELECT
  CASE
    WHEN referrer IS NULL OR referrer = '' THEN '直接访问'
    ELSE referrer
  END as 引荐来源,
  COUNT(*) as 访问次数
FROM visitor_sessions
GROUP BY referrer
ORDER BY 访问次数 DESC
LIMIT 20;
```

## 📈 详细访客行为分析

### 8. 完整访客会话记录（包含页面浏览详情）
```sql
SELECT
  vs.visitor_id as 访客ID,
  vs.session_start as 访问时间,
  vs.landing_page as 着陆页,
  vs.total_page_views as 浏览页数,
  vs.total_duration_seconds as 停留时长秒,
  vs.device_type as 设备类型,
  vs.browser as 浏览器,
  vs.session_end as 结束时间,
  CASE
    WHEN vs.session_end IS NULL THEN '在线'
    ELSE '已离开'
  END as 状态
FROM visitor_sessions vs
ORDER BY vs.session_start DESC
LIMIT 100;
```

### 9. 查看某个访客的详细浏览轨迹
```sql
-- 替换 'YOUR_VISITOR_ID' 为实际的访客ID
SELECT
  pv.page_path as 访问页面,
  pv.view_start as 进入时间,
  pv.duration_seconds as 停留秒数,
  pv.scroll_depth_percent as 滚动深度百分比
FROM page_views pv
JOIN visitor_sessions vs ON vs.id = pv.session_id
WHERE vs.visitor_id = 'YOUR_VISITOR_ID'
ORDER BY pv.view_start ASC;
```

### 10. 查看特定会话的所有页面浏览记录
```sql
-- 替换 'SESSION_ID' 为实际的会话ID
SELECT
  page_path as 页面路径,
  page_title as 页面标题,
  view_start as 开始时间,
  view_end as 结束时间,
  duration_seconds as 停留秒数,
  scroll_depth_percent as 滚动深度
FROM page_views
WHERE session_id = 'SESSION_ID'
ORDER BY view_start ASC;
```

### 11. 查看用户交互行为（点击等）
```sql
SELECT
  va.action_type as 动作类型,
  va.element_text as 点击元素文本,
  va.created_at as 发生时间,
  pv.page_path as 所在页面
FROM visitor_actions va
LEFT JOIN page_views pv ON pv.id = va.page_view_id
ORDER BY va.created_at DESC
LIMIT 100;
```

## 📅 时间维度分析

### 12. 每小时访问统计（今日）
```sql
SELECT
  EXTRACT(HOUR FROM session_start) as 小时,
  COUNT(*) as 访问次数,
  ROUND(AVG(total_duration_seconds)) as 平均停留秒数
FROM visitor_sessions
WHERE session_start >= CURRENT_DATE
GROUP BY EXTRACT(HOUR FROM session_start)
ORDER BY 小时;
```

### 13. 过去7天访问趋势
```sql
SELECT
  DATE(session_start) as 日期,
  COUNT(*) as 访问次数,
  COUNT(DISTINCT visitor_id) as 独立访客数,
  ROUND(AVG(total_duration_seconds)) as 平均停留秒数,
  SUM(total_page_views) as 页面浏览数
FROM visitor_sessions
WHERE session_start >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(session_start)
ORDER BY 日期 DESC;
```

### 14. 过去30天访问趋势
```sql
SELECT
  DATE(session_start) as 日期,
  COUNT(*) as 访问次数,
  COUNT(DISTINCT visitor_id) as 独立访客数,
  ROUND(AVG(total_duration_seconds)) as 平均停留秒数
FROM visitor_sessions
WHERE session_start >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(session_start)
ORDER BY 日期 DESC;
```

## 🎯 高级分析查询

### 15. 访客留存分析（回访访客）
```sql
SELECT
  visitor_id as 访客ID,
  COUNT(*) as 访问次数,
  MIN(session_start) as 首次访问,
  MAX(session_start) as 最后访问,
  SUM(total_page_views) as 累计浏览页数,
  SUM(total_duration_seconds) as 累计停留秒数
FROM visitor_sessions
GROUP BY visitor_id
HAVING COUNT(*) > 1
ORDER BY 访问次数 DESC
LIMIT 50;
```

### 16. 高价值访客识别（停留时间长、浏览页面多）
```sql
SELECT
  visitor_id as 访客ID,
  COUNT(*) as 访问次数,
  SUM(total_page_views) as 累计浏览页数,
  SUM(total_duration_seconds) as 累计停留秒数,
  ROUND(AVG(total_duration_seconds)) as 平均每次停留秒数,
  MAX(session_start) as 最后访问时间
FROM visitor_sessions
GROUP BY visitor_id
HAVING SUM(total_duration_seconds) > 300 OR SUM(total_page_views) > 10
ORDER BY 累计停留秒数 DESC
LIMIT 50;
```

### 17. 跳出率分析（只浏览一个页面就离开）
```sql
SELECT
  landing_page as 着陆页,
  COUNT(*) as 总访问次数,
  COUNT(*) FILTER (WHERE total_page_views = 1) as 跳出次数,
  ROUND(
    COUNT(*) FILTER (WHERE total_page_views = 1) * 100.0 / COUNT(*),
    2
  ) as 跳出率百分比
FROM visitor_sessions
GROUP BY landing_page
HAVING COUNT(*) >= 10
ORDER BY 总访问次数 DESC;
```

### 18. 页面退出率分析
```sql
SELECT
  page_path as 页面路径,
  COUNT(*) as 浏览次数,
  COUNT(*) FILTER (WHERE view_end IS NOT NULL AND duration_seconds < 10) as 快速离开次数,
  ROUND(
    COUNT(*) FILTER (WHERE view_end IS NOT NULL AND duration_seconds < 10) * 100.0 / COUNT(*),
    2
  ) as 快速离开率百分比
FROM page_views
GROUP BY page_path
HAVING COUNT(*) >= 10
ORDER BY 浏览次数 DESC;
```

## 🔍 实时监控查询

### 19. 当前在线访客
```sql
SELECT
  visitor_id as 访客ID,
  landing_page as 着陆页,
  session_start as 访问开始时间,
  total_page_views as 已浏览页数,
  total_duration_seconds as 已停留秒数,
  device_type as 设备类型,
  browser as 浏览器
FROM visitor_sessions
WHERE session_end IS NULL
ORDER BY session_start DESC;
```

### 20. 最近10分钟的访问活动
```sql
SELECT
  vs.visitor_id as 访客ID,
  vs.session_start as 访问时间,
  vs.landing_page as 着陆页,
  vs.device_type as 设备,
  pv.page_path as 当前页面
FROM visitor_sessions vs
LEFT JOIN LATERAL (
  SELECT page_path
  FROM page_views
  WHERE session_id = vs.id
  ORDER BY view_start DESC
  LIMIT 1
) pv ON true
WHERE vs.session_start >= NOW() - INTERVAL '10 minutes'
ORDER BY vs.session_start DESC;
```

## 📋 数据导出查询

### 21. 导出完整访客数据（用于Excel分析）
```sql
SELECT
  vs.visitor_id as "访客ID",
  vs.session_start as "访问时间",
  vs.session_end as "离开时间",
  vs.landing_page as "着陆页",
  vs.total_page_views as "浏览页数",
  vs.total_duration_seconds as "停留秒数",
  vs.device_type as "设备类型",
  vs.browser as "浏览器",
  vs.os as "操作系统",
  vs.referrer as "来源",
  CASE
    WHEN vs.session_end IS NULL THEN '在线'
    ELSE '已离开'
  END as "状态"
FROM visitor_sessions vs
ORDER BY vs.session_start DESC;
```

## 💡 使用提示

1. **在 Supabase Dashboard 中使用**：
   - 登录 Supabase Dashboard
   - 进入 SQL Editor
   - 复制粘贴上述查询
   - 点击 Run 执行

2. **查询结果说明**：
   - 所有时间以数据库时区为准
   - 停留时长单位为秒
   - 滚动深度为 0-100 的百分比

3. **性能优化**：
   - 大数据量时使用 LIMIT 限制结果数量
   - 使用日期范围过滤提高查询速度
   - 已为常用字段创建索引

4. **自定义查询**：
   - 可根据需要修改时间范围
   - 可调整 LIMIT 数量
   - 可添加更多筛选条件
