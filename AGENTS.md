# RightMenu Refresh project instructions

- 本仓库只维护 Refresh 插件；RightMenu 宿主和其他插件属于独立仓库。
- 插件自身的业务逻辑、菜单、本地化、图标、权限、测试和打包问题优先在本仓库解决。
- 只有缺少或损坏通用宿主 API、能力、生命周期、安装、安全或兼容机制时才修改宿主；不得要求宿主加入 Refresh 专用逻辑。
- 插件版本以 `package.json` 为维护入口，并同步 `package-lock.json` 根包版本、`plugin/manifest.base.json`、README 与 `CHANGELOG.md`。
- 未指定版本时，可分发改动默认递增补丁版本；明确的兼容性或产品里程碑可递增次版本或主版本。
- 文档维护规则澄清不递增版本。宿主版本变化不自动改变本插件版本，除非插件产物或兼容声明也改变。
- 提交和发布只包含本插件改动；私钥、`dist/` 和 `node_modules/` 永不提交。
- 提交前至少运行 `npm test`；涉及打包、签名或宿主契约时运行 `npm run verify`。
- README 的“当前架构与设计意图”是本插件结构、调用链和宿主边界基线；结构或边界变化时同步更新。
