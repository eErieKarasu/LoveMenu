-- ============================================
-- LoveMenu — Supabase 数据库建表语句
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================

-- 表1: dishes（菜谱总库）
CREATE TABLE IF NOT EXISTS dishes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  emoji text DEFAULT '🍽️',
  created_at date DEFAULT CURRENT_DATE,
  last_cooked_date date
);

-- 表2: daily_menus（每日菜单历史）
-- items 字段格式: [{ "dish_id": "uuid", "dish_name": "xxx", "emoji": "🍅" }]
CREATE TABLE IF NOT EXISTS daily_menus (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date UNIQUE NOT NULL,
  status text DEFAULT 'draft',  -- draft | completed
  items jsonb DEFAULT '[]'::jsonb
);

-- 开启行级安全（RLS）
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_menus ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（前端密码门代替服务端鉴权）
CREATE POLICY "allow_all_dishes" ON dishes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_menus" ON daily_menus FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 完成后请在 Supabase 控制台执行：
-- Database → Replication → 将 dishes 和 daily_menus 加入 Realtime 订阅
-- ============================================
