# RightMenu Refresh

RightMenu 的独立“刷新”插件。它在 Finder 文件夹空白处和桌面背景菜单中提供“刷新”，调用宿主受控的 `ui.flashScreen` 能力显示怀旧闪屏，不读写任何文件。

## 版本

- 插件：`1.0.0`
- 最低宿主插件 API：`1.2`

## 构建与验证

```bash
npm install
npm run keygen
npm run verify
```

签名包输出到 `dist/Refresh.rightmenuplugin`。私钥仅保存在被 Git 忽略的 `.keys/`，不要提交或分享。

## 安装

在 RightMenu 的“插件”设置页点击“导入已签名插件…”，选择 `dist/Refresh.rightmenuplugin`。导入后即可使用，无需开启开发者模式或另行授权；“刷新”会由插件投影到 Finder 容器菜单，卸载插件后菜单项立即消失。
