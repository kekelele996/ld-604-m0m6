export interface RepairTicket { id: number; fault_report_id: number; team_id: number; dispatcher_id: number; priority: string; status: string; assigned_at: string | null; restored_at: string | null }
// 工单详情视图：带上关联资产按未复电故障重算后的当前健康。
export interface RepairTicketAssetView extends RepairTicket { fault_type: string | null; asset_id: number | null; asset_code: string | null; asset_health_status: string | null; asset_health_source: string | null }
