# Julia Liu — 網站結構文件

## 頁面架構

```
juliahahah.github.io/
├── index.html          ← 主網站檔案
└── photos/
    ├── gallery/
    │   ├── green-path-nycu/    ← GreenPath（交大外拍，8張）
    │   ├── blue-hour/          ← Blue Hour（黃昏街頭，5張）
    │   ├── amber/              ← Amber（復古書店，10張）
    │   ├── spark/              ← Spark（仙女棒夜拍，7張）
    │   ├── stage-dance/        ← Off Stage（停車場外拍，10張）
    │   └── stage-performance/  ← Renaissance（成發演出，14張）
    ├── community/              ← Community 分頁活動照（aws_01/02 = AWS Taiwan 2026.05、dream_01 = 圓夢成果活動 2025.12）
    └── episodes/
        ├── japan/              ← 日本 2025.10
        ├── france/             ← 法國 2025.06
        ├── singapore/          ← 新加坡 2025.11
        ├── malaysia/           ← 馬來西亞 2025.06
        ├── philippines/        ← 菲律賓 2025.01
        ├── china/              ← 中國 2023.07
        ├── macau/              ← 澳門 2025.02
        ├── taiwan/             ← 台灣 各地
        ├── usa/                ← 美國 2026.06（CVPR Denver＋矽谷，12張）
        ├── thailand/           ← 泰國 2026.08（曼谷，10張）
        └── korea/              ← 韓國 2026.09（釜山＋首爾，12張）
```

## Gallery Tab 對照

| Tab 名稱     | 資料夾                  | 張數 | 說明               |
|-------------|------------------------|-----|--------------------|
| GreenPath   | gallery/green-path-nycu | 8   | 交大校園，綠意自然光 |
| Blue Hour   | gallery/blue-hour       | 5   | 黃昏街頭，藍紫夕陽  |
| Amber       | gallery/amber           | 10  | 復古書店，暖黃燈光  |
| Spark       | gallery/spark           | 7   | 仙女棒夜拍，點燃時刻|
| Off Stage   | gallery/stage-dance     | 10  | 黑色穿搭，停車場外拍|
| Renaissance | gallery/stage-performance| 14  | NTHU KDC 成發演出  |

## 照片命名規則

| 系列        | 命名格式       | 範例         |
|------------|---------------|-------------|
| GreenPath  | nycu_01.jpg   | nycu_01~08  |
| Blue Hour  | bh_01.jpg     | bh_01~05    |
| Amber      | amb_01.jpg    | amb_01~10   |
| Spark      | sp_01.jpg     | sp_01~07    |
| K-Dance    | stage_01.jpg  | stage_01~10 |
| Stage      | perf_01.jpg   | perf_01~14  |

## Episodes 封面照命名規則

每個國家放 **1 張代表照**，統一命名為 `cover.jpg`：

| 資料夾                  | 對應 HTML 路徑                          | 日期      |
|------------------------|----------------------------------------|----------|
| episodes/japan/        | photos/episodes/japan/cover.jpg        | 2025.10  |
| episodes/france/       | photos/episodes/france/cover.jpg       | 2025.06  |
| episodes/singapore/    | photos/episodes/singapore/cover.jpg    | 2025.11  |
| episodes/malaysia/     | photos/episodes/malaysia/cover.jpg     | 2025.06  |
| episodes/philippines/  | photos/episodes/philippines/cover.jpg  | 2025.01  |
| episodes/china/        | photos/episodes/china/cover.jpg        | 2023.07  |
| episodes/macau/        | photos/episodes/macau/cover.jpg        | 2025.02  |
| episodes/taiwan/       | photos/episodes/taiwan/cover.jpg       | ——       |

## 導覽頁面

| 頁面       | 說明                                 |
|-----------|--------------------------------------|
| About     | 自我介紹、身份卡片、時間軸            |
| Gallery   | 外拍照片集，分系列 tab 切換           |
| Thoughts  | 個人文章（法國、AWS、鴻海）           |
| Episodes  | 旅遊紀錄（12 個國家分頁，和 About 的 12 國一致；香港已拿掉） |
| Projects  | 作品集（研究 / 個人專案兩類）         |
| Community | 活動與社群（校園大使、工作坊、助教、黑客松、志工），照片在 photos/community/ |

## 待補內容

- [ ] Episodes 各國旅遊封面照
- [ ] About 頁照片
- [ ] Thoughts 文章內文
- [ ] Off Stage / Renaissance tab 名稱已確認

## 語言設定

預設：英文（EN）
切換：點右上角「中文」按鈕

## 部署

目標：`juliahahah.github.io`
方式：GitHub Pages（main branch）


## 語言

2026-11-11 起網站只保留英文：語言切換按鈕已拿掉，data-zh/fr/ja/ko 屬性都刪了，只留 data-en。
