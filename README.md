# 电力配网抢修工单系统

面向供电所的配网故障报修、抢修派工、备件领用和停电恢复跟踪平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20104>

后端健康检查：<http://localhost:21104/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + TypeScript + Vite + Element Plus + Pinia |
| 后端 | Node.js + Express + TypeScript + Prisma |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `grid-repair`
- `FRONTEND_PORT`: 前端端口，默认 `20104`
- `BACKEND_PORT`: 后端端口，默认 `21104`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## 资产健康状态判定口径

健康状态不再停留在建档值，而是跟着故障走，**以该资产尚未复电的故障为准**：

- 报修关联的抢修工单没有任何一张进入 `RESTORED` / `CLOSED`（含尚未派工的报修），即视为**未复电故障**。
- 故障类型分轻重映射健康等级：`EQUIPMENT_DAMAGE`、`SAFETY_RISK` → `DANGEROUS`；`TRIP`、`OUTAGE` → `DEGRADED`；`VOLTAGE_LOW` → `WATCH`（跳闸、设备损坏比低电压重）。
- 当前健康 = max（建档状态， 未复电故障映射的最重等级）；`health_source` 为 `FAULT_DRIVEN` 表示被故障拉高，`BASELINE` 表示沿用建档值。
- 全部故障复电后回到建档状态（建档为 `NORMAL` 即"回正常"）；从未登记过故障的资产始终沿用建档状态。

资产台账（`/assets`）、抢修态势的资产健康统计（`/dashboard`）、工单详情（`/tickets`）三处共用这一套口径：

- 后端实现在 `backend/src/services/AssetHealthService.ts`，映射规则在 `backend/src/constants/AssetHealthRule.ts`；台账接口 `GET /api/grid-asset`、统计接口 `GET /api/grid-asset/health-stats`、工单接口 `GET /api/repair-ticket` 均返回重算后的健康状态。
- 前端在 `frontend/src/utils/assetHealth.ts` 保留同一口径的镜像实现，仅供接口不可用时的本地 mock 兜底使用；映射规则镜像在 `frontend/src/constants/AssetHealthRule.ts`。

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: grid-repair`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-grid-repair}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- FaultType: constants/FaultType、types/FaultType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- TicketStatus: constants/TicketStatus、types/TicketStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- AssetHealthStatus: constants/AssetHealthStatus、types/AssetHealthStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- AssetHealthRule（故障类型→健康等级映射、复电终态、健康来源）: backend/src/constants/AssetHealthRule.ts 与 frontend/src/constants/AssetHealthRule.ts 双份镜像，被 backend/src/services/AssetHealthService.ts、frontend/src/utils/assetHealth.ts、资产台账/抢修态势/工单详情页面共同引用；调整映射或复电终态时前后端两处必须同步。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
