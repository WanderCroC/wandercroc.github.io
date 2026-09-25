# Chengcheng Wang | 王成铖 — GitHub Pages 版本

这是可以部署到 GitHub Pages 的个人学术网站，保留目前网站的内容、Arizona 配色、深色默认主题、日夜切换和手机布局。网页、照片和 PDF 均随包提供。

此版本尚未发布到 GitHub；原有网站不受影响。

## 首次发布

### 1. 创建 GitHub 仓库

登录 GitHub，创建一个新仓库，默认分支使用 `main`。推荐选择 Public，以便使用免费 GitHub Pages。

两种仓库命名都支持：

| 选择 | 仓库名称示例 | 发布后的网址 |
| --- | --- | --- |
| 个人主页 | `你的用户名.github.io` | `https://你的用户名.github.io/` |
| 普通项目仓库 | `academic-website` | `https://你的用户名.github.io/academic-website/` |

个人主页仓库名称中的用户名必须与你的 GitHub 用户名一致。普通项目仓库名称可以自定，工作流会自动适配网址中的仓库路径，无需修改网页链接。

GitHub Pages 发布的网站通常对所有人公开；私人仓库也不等于私人网站。

### 2. 上传这个文件夹里的内容

先解压下载的 ZIP，再将**解压后文件夹里面的内容**上传到仓库根目录，不要只上传 ZIP，也不要在仓库中再套一层 `chengcheng-wang-github-pages` 文件夹。

仓库根目录应能看到 `README.md`、`package.json`、`site/`、`scripts/` 和 `.github/`。尤其要保留 `.github/workflows/pages.yml`，这是自动部署配置。某些文件管理器会隐藏以点开头的目录，上传前请确认 `.github` 已包含。

你可以使用 GitHub 网页上的 **Add file → Upload files** 上传。如果拖拽上传时遗漏 `.github`，请使用 GitHub Desktop 或下面的 Git 方法，确保工作流文件也进入仓库。

### 3. 启用 GitHub Pages

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 打开仓库的 **Actions** 页面，查看 **Deploy GitHub Pages** 工作流。
4. 如第一次上传触发的运行因尚未启用 Pages 而失败，在启用后点击 **Re-run all jobs**；也可以选择 **Run workflow**，分支选 `main`。
5. 等工作流显示成功后，在 **Settings → Pages** 中打开网站地址。工作流的部署记录中也会提供网址。

工作流使用 GitHub 自带的授权，无需创建访问令牌，也无需添加任何 Secrets。此网站不需要安装 npm 依赖。

如果使用的默认分支不是 `main`，请先修改 `.github/workflows/pages.yml` 中的 `branches: [main]`，使其与你的分支名称一致。

### 可选：通过 Git 上传

下面的命令在解压后的项目文件夹内执行。先把 `YOUR_USERNAME` 和 `YOUR_REPOSITORY` 替换为实际用户名、仓库名称；仓库应已在 GitHub 创建。

```bash
git init
git add .
git commit -m "Add academic website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Git 会通过你已配置的 GitHub 登录方式完成身份验证。上传后，仍需按上面的步骤在 Pages 设置中选择 GitHub Actions。

## 日常修改

编辑 `site/` 中的源文件并提交到 `main`，GitHub Actions 就会重新生成并发布网站。

| 想修改的内容 | 文件 |
| --- | --- |
| 主页文字、名字、邮箱和照片引用 | `site/index.html` |
| 论文、摘要、Draft、SSRN 等链接 | `site/research/index.html` |
| 教学经历 | `site/teaching/index.html` |
| CV 页面及打开按钮 | `site/cv/index.html` |
| CV PDF | `site/assets/CV_Chengcheng.pdf` |
| Job Market Paper PDF | `site/assets/Differentially_Private_Market_Segmentation.pdf` |
| 信息披露论文 PDF | `site/assets/Strategic_Information_Disclosure.pdf` |
| 当前头像 | `site/assets/profile-soft.png` |
| 配色、字体、电脑和手机布局 | `site/assets/style.css` |
| 深色默认主题及主题切换 | `site/assets/theme.js` |
| 找不到页面时的提示 | `site/404.html` |
| 自动部署配置 | `.github/workflows/pages.yml` |

更新 PDF 时，可直接用新文件替换同名 PDF，无需改链接。换照片时，既可以替换当前同名文件，也可以上传新文件并修改 `site/index.html` 的图片路径。

在 `site/` 源文件中，站内链接继续写成 `/research/`、`/cv/`、`/assets/文件名.pdf` 等形式即可。部署脚本会根据 GitHub Pages 的实际路径自动加上必要的仓库前缀；外部链接、邮箱链接及页面内锚点会保留。

## 本地预览与检查

本地运行需要 Node.js 22 或更新版本。没有第三方依赖，**不需要运行 `npm install`**。

```bash
npm run preview
```

此命令会先构建网站，再启动本地服务器。用浏览器打开：

```text
http://localhost:8080
```

停止预览时，在终端按 `Ctrl+C`。不要通过双击 HTML 文件预览；网站使用站内绝对路径，需要通过服务器访问。

只构建、不启动服务器：

```bash
npm run build
```

检查构建后的网站内部链接与资源：

```bash
npm run check
```

`check` 用于检查生成文件中的本地链接，不会验证 SSRN、arXiv 等外部网站是否可访问。

如需手动模拟普通项目仓库的路径：

```bash
node scripts/build.mjs --base-path /academic-website
npm run check -- --base-path /academic-website
```

也可以通过环境变量 `PAGES_BASE_PATH` 指定路径。命令行 `--base-path` 用于手动构建；GitHub 工作流会自动传入 `configure-pages` 提供的真实 `base_path`。个人主页或根域名的路径为空，普通项目主页的路径通常为 `/仓库名称`。

## 文件结构与构建方式

| 位置 | 用途 |
| --- | --- |
| `site/` | 需要长期维护的网页及静态资源 |
| `scripts/build.mjs` | 将 `site/` 生成到 `_site/`，适配站内链接的部署路径 |
| `scripts/` | 本地预览和检查等辅助脚本 |
| `_site/` | 自动生成的网站文件；无需手动修改或提交 |
| `.github/workflows/pages.yml` | 自动构建并部署到 GitHub Pages |

GitHub 工作流在推送到 `main` 或手动触发时运行，使用 Node.js 24，生成并上传 `_site/`，再发布到 `github-pages` 环境。个人主页与普通项目主页共用同一套源文件，无需分别维护。

## 官方说明

- [GitHub Pages 的发布来源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [使用自定义 GitHub Actions 工作流发布 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [configure-pages 的参数与 base_path 输出](https://github.com/actions/configure-pages/blob/main/action.yml)
- [GitHub Pages 简介与网址规则](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
