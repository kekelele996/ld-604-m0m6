export const createGridAssetDto = (overrides = {}) => ({ id: 1, asset_code: "asset code 1", asset_type: "配电变压器", feeder_line: "feeder line 1", voltage_level: "10kV", location_desc: "location desc 1", health_status: "NORMAL", owner_team_id: 1, ...overrides });

// 资产健康视图：health_status 为按未复电故障重算后的当前健康，baseline_health_status 保留建档值。
export const createGridAssetHealthView = (overrides = {}) => ({ ...createGridAssetDto(), baseline_health_status: "NORMAL", health_source: "BASELINE", open_fault_count: 0, open_fault_types: [] as string[], ...overrides });

export const createAssetHealthStats = (overrides = {}) => ({ NORMAL: 0, WATCH: 0, DEGRADED: 0, DANGEROUS: 0, total: 0, fault_driven: 0, ...overrides });
