export const createRepairTicketDto = (overrides = {}) => ({ id: 1, fault_report_id: 1, team_id: 1, dispatcher_id: 1, priority: "priority 1", status: "ASSIGNED", assigned_at: "2026-06-11T09:00:00Z", restored_at: null, ...overrides });

// 工单详情视图：关联资产当前健康（按未复电故障重算）随单一同返回。
export const createRepairTicketAssetView = (overrides = {}) => ({ ...createRepairTicketDto(), fault_type: null, asset_id: null, asset_code: null, asset_health_status: null, asset_health_source: null, ...overrides });
