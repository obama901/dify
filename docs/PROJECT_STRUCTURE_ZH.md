# Dify 项目结构说明

本文档面向后续二次开发，帮助开发者快速理解 Dify 仓库的模块边界、目录职责、常用入口和修改建议。内容基于当前仓库结构整理，优先说明“改某类功能时应该先看哪里”。

## 1. 项目整体定位

Dify 是一个面向 LLM 应用开发的平台，核心能力包括工作流编排、RAG 数据管线、Agent、模型供应商管理、插件/工具、应用运行 API、可观测性和 Web 控制台。

仓库采用 monorepo 方式组织，主要由以下部分组成：

| 目录 | 作用 |
| --- | --- |
| `api/` | 后端 API 服务，Python Flask 应用，按 DDD/Clean Architecture 思路组织业务、领域能力、控制器、异步任务和数据模型。 |
| `web/` | 前端 Web 控制台，Next.js + React + TypeScript 应用，包含路由页面、业务组件、请求服务、i18n 和测试。 |
| `docker/` | Docker Compose 自托管部署配置，以及本地开发依赖的中间件配置。 |
| `dify-agent/` | Dify Agent 运行时与 Agenton 相关 Python 包，提供 agent stub、server、协议和示例。 |
| `cli/` | `difyctl` 命令行客户端，提供登录、应用查询、运行应用等命令。 |
| `packages/` | 前端/CLI 共享的 workspace 包，包括 UI 组件库、OpenAPI 合约、图标集合、tsconfig 和开发代理。 |
| `e2e/` | 仓库级端到端测试，使用 Cucumber + Playwright，覆盖后端、前端生产构建和 Docker 中间件。 |
| `docs/` | 项目文档与多语言 README，适合放置说明、迁移和设计类文档。 |
| `sdks/` | SDK 相关代码与说明，目前包含 Node.js、PHP 客户端目录，并链接到其他语言 SDK。 |
| `dev/` | 本地开发脚本入口，如 setup、启动 API、启动 Web、启动 worker、中间件编排等。 |
| `scripts/` | 仓库级辅助脚本，目前包含压力测试等通用脚本。 |
| `images/` | README 和文档使用的图片资源。 |
| `.github/` | GitHub 工作流、Issue 模板、复用 action、脚本和仓库自动化配置。 |
| `.agents/` | 本仓库为编码代理准备的本地技能与约束说明。 |
| `.claude/`、`.gemini/` | 面向其他 AI 编码工具的项目说明/技能配置。 |
| `.devcontainer/` | VS Code Dev Container 开发环境配置。 |
| `.vscode/` | VS Code 推荐配置。 |
| `.vite-hooks/` | Vite/Vite+ 相关 hook 配置。 |

## 2. 根目录关键文件

| 文件 | 作用 |
| --- | --- |
| `README.md` | 项目总体介绍、功能概览和 Docker 快速启动说明。 |
| `CONTRIBUTING.md` | 贡献指南。 |
| `AGENTS.md` | 仓库级开发约定，说明后端/前端入口、测试、类型和编码风格要求。 |
| `package.json` | JavaScript workspace 根配置，声明 Node/pnpm 版本、根级 lint/type-check/dev 脚本。 |
| `pnpm-workspace.yaml` | pnpm workspace 范围、依赖 catalog、overrides 和安全构建策略。 |
| `pnpm-lock.yaml` | JS 依赖锁文件。 |
| `.nvmrc` | Node 版本提示。 |
| `LICENSE` | Dify 开源许可证。 |

开发 JavaScript/TypeScript 相关内容时，应从仓库根目录执行 `pnpm install`，再使用 `pnpm -C web ...`、`pnpm -C e2e ...` 或 workspace 脚本。

## 3. 后端 `api/`

`api/` 是 Dify 的主后端服务，技术栈包括 Flask、Flask-RESTX、SQLAlchemy、Celery、Redis、PostgreSQL、Pydantic v2、uv。后端开发命令应优先使用：

```bash
uv run --project api <command>
```

常见入口：

| 文件 | 作用 |
| --- | --- |
| `api/app.py` | 后端应用启动入口。 |
| `api/app_factory.py` | Flask 应用工厂，负责组装应用与扩展。 |
| `api/dify_app.py` | Dify 应用封装相关入口。 |
| `api/celery_entrypoint.py` | Celery worker 入口。 |
| `api/celery_healthcheck.py` | Celery 健康检查。 |
| `api/gunicorn.conf.py` | Gunicorn 部署配置。 |
| `api/pyproject.toml` | Python 依赖、uv workspace、测试和工具配置。 |
| `api/uv.lock` | Python 依赖锁文件。 |
| `api/.env.example` | 后端环境变量模板。 |

### 3.1 `api/` 一级目录职责

| 目录 | 作用 |
| --- | --- |
| `api/clients/` | 外部或内部服务客户端封装。 |
| `api/commands/` | Flask/CLI 命令，通常用于初始化、维护、数据处理等后台操作。 |
| `api/configs/` | 配置读取与配置对象，开发中应通过 `configs.dify_config` 获取配置，避免直接读取环境变量。 |
| `api/constants/` | 后端常量定义。 |
| `api/context/`、`api/contexts/` | 请求上下文、租户/用户上下文等运行期上下文能力。 |
| `api/controllers/` | HTTP API 控制器层，负责参数解析、调用 service、序列化响应，不承载核心业务逻辑。 |
| `api/core/` | 核心领域能力，包含应用、工作流、RAG、Agent、工具、插件、模型调用、MCP、提示词、文件、可观测性等。 |
| `api/dev/` | 后端开发辅助脚本，例如生成 OpenAPI/Swagger、维护工具等。 |
| `api/docker/` | 后端镜像或容器运行相关的局部配置。 |
| `api/enterprise/` | 企业版或企业特性相关扩展代码。 |
| `api/enums/` | 枚举类型定义。 |
| `api/events/` | 事件定义与事件处理。 |
| `api/extensions/` | Flask 扩展、数据库、缓存、存储、日志等基础设施初始化。 |
| `api/factories/` | 工厂方法，集中创建领域对象、provider、服务实例等。 |
| `api/fields/` | API 字段或序列化字段定义。 |
| `api/libs/` | 后端通用库和基础工具。 |
| `api/migrations/` | 数据库迁移脚本。 |
| `api/models/` | SQLAlchemy 数据模型。 |
| `api/openapi/` | OpenAPI 规格输出和相关生成物。 |
| `api/providers/` | 可插拔 provider 包，当前主要包含向量数据库和 trace provider。 |
| `api/repositories/` | 仓储层，封装重要数据访问逻辑。 |
| `api/schedule/` | 定时任务调度相关代码。 |
| `api/services/` | 应用服务层，协调模型、仓储、provider、任务和业务流程。 |
| `api/tasks/` | Celery 异步任务实现。 |
| `api/templates/` | 后端模板文件。 |
| `api/tests/` | 后端测试，包含单元测试和集成测试目录。 |

### 3.2 `api/core/` 重点领域

| 目录 | 作用 |
| --- | --- |
| `api/core/app/` | Dify 应用领域，包括应用配置、应用实体、功能开关、文件访问、LLM 和工作流应用逻辑。 |
| `api/core/workflow/` | 工作流执行引擎、节点、图结构、生成器等。 |
| `api/core/rag/` | RAG 管线，覆盖数据清洗、切分、索引、embedding、rerank、检索、文档存储和摘要索引。 |
| `api/core/agent/` | Agent 策略、提示词、输出解析等能力。 |
| `api/core/tools/` | 内置工具、自定义工具、MCP 工具、插件工具、工作流作为工具等。 |
| `api/core/plugin/` | 插件调用、插件 endpoint、插件实体与兼容层。 |
| `api/core/datasource/` | 数据源接入，包括本地文件、在线文档、网盘、网站抓取等。 |
| `api/core/mcp/` | MCP server/client/session/auth 相关能力。 |
| `api/core/llm_generator/` 等模型相关逻辑 | 模型调用、模型配置和运行时通常会通过 core 与 providers/services 协同完成，修改模型接入时需要同时检查 provider、service 和配置。 |
| `api/core/ops/`、`api/core/telemetry/` | 运维与可观测性能力。 |
| `api/core/errors/` | 核心领域异常。 |
| `api/core/helper/` | SSRF 代理、代码执行、通用辅助能力。 |

### 3.3 `api/providers/`

`api/providers/` 是后端 provider 插件化扩展区，并在 `api/pyproject.toml` 中通过 uv workspace 管理。

| 目录 | 作用 |
| --- | --- |
| `api/providers/vdb/` | 向量数据库 provider 包集合，例如 Weaviate、Milvus、Qdrant、PGVector、Elasticsearch、OpenSearch、Chroma、OceanBase 等。 |
| `api/providers/trace/` | trace/可观测性 provider 包集合，例如 Langfuse、LangSmith、MLflow、Opik、Arize Phoenix、Weave、腾讯云、阿里云等。 |

如果要新增向量数据库或 trace 后端，应优先参考相邻 provider 包的 `pyproject.toml`、入口点注册和 README。

### 3.4 后端修改建议

- 控制器只做输入输出和服务编排，业务规则放在 `services/` 或 `core/`。
- 涉及数据库读写时先查 `models/` 和现有 repository/service，避免散落 SQL。
- 后台任务放在 `tasks/`，通过 service 显式派发，并注意幂等性。
- 需要存储文件时使用 `extensions.ext_storage.storage`。
- 对外 HTTP 抓取应使用 `core.helper.ssrf_proxy`。
- 多租户数据访问必须贯穿 `tenant_id`。
- 修改后端代码前，应阅读目标文件的模块/类/函数 docstring 与注释，它们被视为规格的一部分。

## 4. 前端 `web/`

`web/` 是 Dify 控制台和分享页前端，技术栈包括 Next.js、React、TypeScript、Tailwind、TanStack Query、Jotai/Zustand、Vitest、Storybook、Vite+。

常用命令：

```bash
pnpm install
pnpm -C web run dev
pnpm -C web run dev:vinext
pnpm -C web run type-check
pnpm -C web run test
pnpm -C web run storybook
```

### 4.1 `web/` 一级目录职责

| 目录 | 作用 |
| --- | --- |
| `web/app/` | Next.js App Router 页面、布局和大量页面内组件，是前端业务页面主入口。 |
| `web/app/components/` | Web 应用内组件集合，按业务域划分，如 apps、datasets、workflow、plugins、tools、signin 等。 |
| `web/features/` | 可复用的 feature 级模块，目前包含账号资料、系统能力、标签管理等。 |
| `web/service/` | 前端 API 请求层和服务封装。 |
| `web/models/` | 前端数据模型和类型定义。 |
| `web/types/` | 全局或共享 TypeScript 类型。 |
| `web/hooks/` | 通用 React hooks。 |
| `web/context/` | React context 和上下文状态。 |
| `web/constants/` | 前端常量。 |
| `web/config/` | 前端配置。 |
| `web/contract/` | 前端与 API 合约相关代码。 |
| `web/i18n/` | 多语言文案资源。用户可见字符串必须使用这里的 key，避免硬编码。 |
| `web/i18n-config/` | i18n 运行时配置、server/client 切换逻辑和校验说明。 |
| `web/assets/` | 前端源代码引用的静态资源。 |
| `web/public/` | Next.js public 静态资源。 |
| `web/themes/` | 主题相关配置。 |
| `web/plugins/` | 前端插件相关代码。 |
| `web/scripts/` | 前端脚本，如组件复杂度分析、图标生成、文档路径生成等。 |
| `web/bin/` | 前端构建/嵌入处理等可执行辅助脚本。 |
| `web/next/` | Next.js 扩展或局部封装。 |
| `web/docs/` | 前端开发文档，如 lint、测试、overlay 规范。 |
| `web/test/` | 前端测试工具或测试配置。 |
| `web/__tests__/` | 前端全局测试。 |
| `web/__mocks__/` | 测试 mock。 |
| `web/.storybook/` | Storybook 配置。 |
| `web/docker/` | Web 镜像或容器相关配置。 |

### 4.2 `web/app/` 路由结构

| 目录 | 作用 |
| --- | --- |
| `web/app/(commonLayout)/` | 登录后的主控制台布局，包含 apps、datasets、explore、plugins、tools 等核心页面。 |
| `web/app/(shareLayout)/` | 分享/公开访问布局，包括 chat、chatbot、completion、workflow 等终端用户页面。 |
| `web/app/(humanInputLayout)/` | human-in-the-loop 表单页面布局。 |
| `web/app/signin/`、`web/app/signup/`、`web/app/reset-password/` | 认证相关页面。 |
| `web/app/install/`、`web/app/init/`、`web/app/activate/` | 初始化、安装和激活流程页面。 |
| `web/app/account/` | 账号相关页面。 |
| `web/app/device/` | 设备授权相关页面。 |
| `web/app/styles/` | 全局样式和插件样式。 |

### 4.3 前端修改建议

- 修改用户可见文案时，先在 `web/i18n/en-US/` 增加或复用 key，并同步其他 locale。
- 新增/修改 overlay、弹窗、popover、drawer 时使用 `@langgenius/dify-ui/*` 的 overlay 原语。
- 新增自定义 SVG 图标应放到 `packages/iconify-collections/assets/...`，再生成并通过 Tailwind `i-custom-*` class 使用。
- 组件状态优先使用局部 state；同 feature 共享简单状态可用 Jotai atoms；复杂高频交互优先复用现有 store。
- API 请求优先放在 `web/service/`，类型与合约优先复用 `web/models/`、`web/types/`、`packages/contracts/`。
- 写测试前阅读 `web/docs/test.md`；复杂组件可先运行 `pnpm analyze-component app/components/your-component/index.tsx` 判断测试/拆分策略。

## 5. Docker 部署 `docker/`

`docker/` 用于自托管部署和本地开发中间件启动。

| 目录/文件 | 作用 |
| --- | --- |
| `docker/docker-compose.yaml` | 生产/自托管 Docker Compose 主配置。 |
| `docker/docker-compose.middleware.yaml` | 本地源码开发时启动数据库、Redis、Weaviate 等中间件。 |
| `docker/.env.example` | Docker 部署核心环境变量模板。 |
| `docker/envs/` | 按主题拆分的高级环境变量模板。 |
| `docker/envs/core-services/` | API/Web/worker 等核心服务相关高级配置。 |
| `docker/envs/databases/` | 数据库相关配置模板。 |
| `docker/envs/infrastructure/` | 基础设施组件配置模板。 |
| `docker/envs/vectorstores/` | 向量数据库配置模板。 |
| `docker/nginx/` | Nginx 配置、反向代理和 SSL 目录。 |
| `docker/certbot/` | HTTPS 证书申请与自动续期配置。 |
| `docker/ssrf_proxy/` | SSRF 代理配置。 |
| `docker/startupscripts/` | 容器启动脚本。 |
| `docker/volumes/` | 本地持久化数据挂载目录。 |
| `docker/elasticsearch/`、`docker/pgvector/`、`docker/tidb/`、`docker/couchbase-server/`、`docker/iris/` | 不同数据库/向量库服务的补充配置。 |

快速自托管：

```bash
cd docker
cp .env.example .env
docker compose up -d
```

本地开发中间件通常通过根目录 `dev/start-docker-compose` 或 docker README 中的 middleware compose 命令启动。

## 6. Agent 运行时 `dify-agent/`

`dify-agent/` 是独立 Python 包，同时被 `api/pyproject.toml` 以 editable path 方式引用。

| 目录 | 作用 |
| --- | --- |
| `dify-agent/src/` | Agenton、agent collections、Dify Agent 运行时代码。 |
| `dify-agent/proto/` | gRPC/protobuf 协议定义。 |
| `dify-agent/examples/` | Agenton 和 Dify Agent 示例。 |
| `dify-agent/tests/` | Python 测试。 |
| `dify-agent/docs/` | Agenton 和 Dify Agent 文档，README 指向 `docs/agenton/...` 与 `docs/dify-agent/...`。 |
| `dify-agent/docker/` | Agent 运行时相关容器配置。 |

该包提供 `dify-agent` 和 `dify-agent-stub-server` 命令。若改动 agent 协议或运行时，应同步检查 `api/` 中调用 agent 的逻辑。

## 7. CLI `cli/`

`cli/` 是 `difyctl` 命令行客户端，属于 pnpm workspace 包。

| 目录 | 作用 |
| --- | --- |
| `cli/src/commands/` | CLI 命令实现。 |
| `cli/src/auth/` | 登录、device-flow、token 管理相关逻辑。 |
| `cli/src/api/` | 与 Dify API 通信的客户端封装。 |
| `cli/src/config/`、`cli/src/env/` | 配置文件和环境变量处理。 |
| `cli/src/http/` | HTTP 请求、重试和错误处理。 |
| `cli/src/help/` | 帮助信息和机器可读命令树。 |
| `cli/src/store/`、`cli/src/cache/` | 本地状态、缓存、凭据存储。 |
| `cli/src/framework/` | CLI 框架层抽象。 |
| `cli/bin/` | CLI 可执行入口。 |
| `cli/scripts/` | 构建、发布、命令树生成等脚本。 |
| `cli/test/` | 单元测试、E2E 测试和 fixtures。 |

常用命令包括 `pnpm -C cli type-check`、`pnpm -C cli test`、`pnpm -C cli build`。

## 8. 共享包 `packages/`

| 目录 | 作用 |
| --- | --- |
| `packages/dify-ui/` | Dify 前端共享 UI 组件库。overlay、portal、层级、设计 token 等规则应优先看这里。 |
| `packages/iconify-collections/` | 自定义图标源文件与生成脚本，前端新增 SVG 图标时应放这里。 |
| `packages/contracts/` | API 合约和生成产物，供 web/cli 等 TypeScript 包复用。 |
| `packages/dev-proxy/` | 前端开发代理工具，`web` 的 `dev:proxy` 使用它。 |
| `packages/tsconfig/` | 共享 TypeScript 配置。 |
| `packages/migrate-no-unchecked-indexed-access/` | TS 迁移辅助工具，用于处理 `noUncheckedIndexedAccess` 相关代码迁移。 |

共享包会被 `web/`、`cli/` 等 workspace 包通过 `workspace:*` 引用。改动共享包时，建议至少跑相关消费者的 type-check。

## 9. E2E 测试 `e2e/`

`e2e/` 是仓库级端到端测试，使用 Cucumber 编写场景，Playwright 执行浏览器操作。它覆盖从源码启动的后端、生产构建的前端，以及 Docker 中间件。

| 目录 | 作用 |
| --- | --- |
| `e2e/features/` | Gherkin feature 文件，按业务能力组织场景。 |
| `e2e/features/step-definitions/` | Cucumber 步骤定义。 |
| `e2e/features/support/` | hooks、World、认证状态、诊断等 Cucumber 支撑代码。 |
| `e2e/support/` | Web server 启动/复用等 E2E 支撑逻辑。 |
| `e2e/scripts/` | reset、middleware、backend/frontend 启动和 Cucumber 编排脚本。 |
| `e2e/fixtures/` | E2E 测试夹具。 |

常用命令：

```bash
pnpm -C e2e check
pnpm -C e2e e2e
pnpm -C e2e e2e:full
pnpm -C e2e e2e -- --tags @smoke
```

## 10. SDK `sdks/`

| 目录 | 作用 |
| --- | --- |
| `sdks/nodejs-client/` | Node.js SDK 客户端源码、脚本和测试。 |
| `sdks/php-client/` | PHP SDK 客户端目录。 |

`sdks/README.md` 同时列出了 Java、Go、Ruby 等外部 SDK 仓库链接。二次开发如果要扩展 API 客户端，应结合 `api/openapi/` 和 `packages/contracts/` 判断生成链路。

## 11. 文档 `docs/`

`docs/` 用于项目说明、迁移文档、多语言 README 和设计资料。

| 目录 | 作用 |
| --- | --- |
| `docs/zh-CN/`、`docs/zh-TW/`、`docs/ja-JP/` 等 | 多语言 README 和贡献说明。 |
| `docs/cross-env-app-migration/` | 跨环境应用迁移相关文档。 |
| `docs/weaviate/` | Weaviate 迁移相关文档。 |
| `docs/design/` | 设计相关资料。 |

新增“解释项目结构、开发流程、迁移说明”这类文档时，优先放在 `docs/`。

## 12. 本地开发脚本 `dev/`

`dev/` 是本地源码开发的推荐入口，脚本会处理路径和依赖细节。常见流程：

```bash
./dev/setup
./dev/start-docker-compose
./dev/start-api
./dev/start-web
./dev/start-worker
./dev/start-beat
```

对应关系：

| 脚本 | 作用 |
| --- | --- |
| `dev/setup` | 初始化本地开发环境，复制 env、安装依赖。 |
| `dev/start-docker-compose` | 启动本地开发所需中间件。 |
| `dev/start-api` | 启动后端并执行迁移。 |
| `dev/start-web` | 启动前端开发服务。 |
| `dev/start-worker` | 启动 Celery worker。 |
| `dev/start-beat` | 启动 Celery Beat 定时任务。 |

## 13. 常见二次开发路径

### 13.1 新增或修改后端 API

1. 在 `api/controllers/` 找到对应 HTTP 入口。
2. 在 `api/services/` 找业务编排逻辑。
3. 在 `api/core/` 找领域能力，必要时新增或调整领域对象。
4. 涉及数据库时检查 `api/models/`、`api/repositories/`、`api/migrations/`。
5. 涉及异步流程时检查 `api/tasks/` 和 Celery 配置。
6. 补充 `api/tests/` 中的单元测试。

### 13.2 新增或修改前端页面

1. 在 `web/app/` 找路由页面和 layout。
2. 在 `web/app/components/` 或 `web/features/` 找已有业务组件。
3. 在 `web/service/` 找 API 请求封装。
4. 在 `web/models/`、`web/types/`、`packages/contracts/` 找类型。
5. 在 `web/i18n/` 添加或复用用户可见文案。
6. 在 `web/__tests__/` 或组件附近 `__tests__/` 补充测试。

### 13.3 新增模型、工具、插件或 RAG 能力

| 目标 | 优先查看 |
| --- | --- |
| 新增向量数据库 | `api/providers/vdb/`、`api/core/rag/`、`docker/envs/vectorstores/` |
| 新增 trace provider | `api/providers/trace/`、`api/core/telemetry/` |
| 新增工具 | `api/core/tools/`、`api/core/plugin/`、前端 `web/app/components/tools/` |
| 修改工作流节点 | `api/core/workflow/nodes/`、`web/app/components/workflow/` |
| 修改 RAG 管线 | `api/core/rag/`、`api/services/`、`web/app/components/datasets/` |
| 修改 Agent 行为 | `api/core/agent/`、`dify-agent/`、`api/core/app/` |

### 13.4 修改部署配置

1. 基础 Docker Compose 配置看 `docker/docker-compose.yaml`。
2. 环境变量默认值看 `docker/.env.example`。
3. 高级/可选变量放在 `docker/envs/` 对应主题文件。
4. 本地开发中间件看 `docker/docker-compose.middleware.yaml` 和 `docker/middleware.env`。
5. Nginx、证书、SSRF 代理分别看 `docker/nginx/`、`docker/certbot/`、`docker/ssrf_proxy/`。

## 14. 推荐检查命令

后端：

```bash
uv run --project api ruff check api
uv run --project api ruff format api
uv run --project api pytest api/tests/unit_tests
```

前端：

```bash
pnpm -C web run type-check
pnpm -C web run test
pnpm lint:fix
```

E2E：

```bash
pnpm -C e2e check
pnpm -C e2e e2e -- --tags @smoke
```

CLI：

```bash
pnpm -C cli type-check
pnpm -C cli test
```

实际开发时应根据修改范围选择最小但有效的验证集。后端集成测试通常依赖 CI 或 Docker 环境，本地不一定适合直接全量运行。
