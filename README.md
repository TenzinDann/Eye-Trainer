# EyeTrainer 本地复刻版（Web + 桌面）

本项目已切到 `eyetrainer.gg` 的交互结构：

- 全屏画布训练
- 左下角 `Show Grid` / `Darkmode`
- 左右切换训练
- 自动完成后跳转下一训练
- 顶部 Steam 公告条（可关闭）

## 安装

```bash
npm install
```

## 怎么打开产品

### 1) 打开网页版（开发）

```bash
npm run dev
```

然后在浏览器打开终端给出的地址（默认 `http://localhost:5173`）。

### 2) 打开桌面版（开发）

```bash
npm run dev:desktop
```

会自动弹出桌面窗口。

### 3) 打开桌面打包版（macOS）

```bash
npm run build:desktop
open release/*.dmg
```

如果你只想直接运行 `.app` 而不是安装包：

```bash
npm run pack:desktop
open "release/mac-arm64/Vision Trainer.app"
```
