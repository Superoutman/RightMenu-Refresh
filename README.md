# RightMenu Refresh

RightMenu 的独立“刷新”插件。它在 Finder 文件夹空白处和桌面背景菜单中提供“刷新”，调用宿主受控的 `ui.flashScreen` 能力显示怀旧闪屏，不读写任何文件。

## 版本

- 插件：`1.0.3`
- 最低宿主插件 API：`1.2`

## 维护边界与版本规则

- Refresh 与 RightMenu 宿主、AI Rename 分仓维护，拥有独立版本、提交、标签和发布节奏。
- Refresh 的功能逻辑、菜单、本地化、图标、权限声明、测试和打包问题优先在本仓库解决，不因插件自身问题修改宿主。
- 只有确认缺少可复用的宿主 API、能力、生命周期、安装、安全或兼容机制时，才在宿主仓库扩展通用能力；不得加入 Refresh 专用分支。
- 插件版本以 `package.json` 为维护入口，并与 `package-lock.json` 根包版本、`plugin/manifest.base.json`、README 和 `CHANGELOG.md` 保持一致。
- 可分发的代码、资源、manifest、菜单、权限或行为发生变化时，默认递增补丁版本；明确的兼容性或产品里程碑可递增次版本或主版本。
- 仅修改维护规范等文档时不产生发布版本；宿主升级也不会自动改变 Refresh 版本，除非本插件产物或兼容声明随之变化。

## 当前架构与设计意图

```text
plugin/manifest.base.json         插件 ID、版本、API v1.2、容器菜单与本地化权限说明
src/main.ts                       唯一运行入口，只识别 refresh 动作
types/                            冻结的宿主公开 TypeScript 契约
assets/icon.svg                   遵循宿主规范的单色刷新图形（容器样式由宿主统一提供）
scripts/build.mjs                 打包、闭包哈希与 Ed25519 签名
scripts/verify-host.mjs           真实宿主校验、安装与 capability 验证
tests/                            动作边界和失败关闭测试
dist/Refresh.rightmenuplugin      可重复生成、不提交 Git 的安装包
```

Refresh 的设计目标是证明“一个宿主不认识其业务的插件”也能完整安装和运行。插件只声明
Finder 文件夹/桌面空白处的 `container` 动作，并调用公开的 `ui.flashScreen`；闪屏由宿主
实现，因为屏幕级 AppKit 能力不应下放给插件。插件不读取 selection、不访问文件、不持有
路径或系统权限。卸载或停用插件后，Finder 菜单随宿主发布的声明式投影消失，宿主无需保留
Refresh 开关或专用业务分支。

插件为 capability 用途说明提供英文、简体中文、繁体中文、日语、韩语、德语和法语版本，
供宿主校验与审计；普通 capability 不会伪装成 macOS 系统权限显示在详情页。

插件图标只提供透明背景的单色刷新图形；设置页的渐变底板、圆角、描边、高光与阴影全部由
宿主按统一规范渲染，缺失或无法解析图形时回退到通用拼图图标。

运行链路为：Finder 容器菜单 → 宿主校验动作上下文 → 隔离 Runner 执行 `main.js` →
权限交集校验 → 宿主显示受控闪屏。包可通过双击或设置页导入，两者共用宿主签名验证和确认。

## 构建与验证

```bash
npm install
npm run keygen
npm run verify
```

签名包输出到 `dist/Refresh.rightmenuplugin`。私钥仅保存在被 Git 忽略的 `.keys/`，不要提交或分享。

## 安装

在 RightMenu 的“插件”设置页点击“导入已签名插件…”，选择 `dist/Refresh.rightmenuplugin`。导入后即可使用，无需开启开发者模式或另行授权；“刷新”会由插件投影到 Finder 容器菜单，卸载插件后菜单项立即消失。
