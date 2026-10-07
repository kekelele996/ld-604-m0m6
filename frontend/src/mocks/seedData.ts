export const mockData = {
  "gridAsset": [
    {
      "id": 1,
      "asset_code": "TR-CD-001",
      "asset_type": "配电变压器",
      "feeder_line": "10kV城东线",
      "voltage_level": "10kV",
      "location_desc": "城东街道迎春路12号台区",
      "health_status": "NORMAL",
      "owner_team_id": 1
    },
    {
      "id": 2,
      "asset_code": "RG-CX-002",
      "asset_type": "环网柜",
      "feeder_line": "10kV城西线",
      "voltage_level": "10kV",
      "location_desc": "城西工业园区纬三路",
      "health_status": "WATCH",
      "owner_team_id": 2
    },
    {
      "id": 3,
      "asset_code": "SW-NJ-003",
      "asset_type": "柱上开关",
      "feeder_line": "10kV南郊线",
      "voltage_level": "10kV",
      "location_desc": "南郊乡石桥村台区",
      "health_status": "NORMAL",
      "owner_team_id": 1
    },
    {
      "id": 4,
      "asset_code": "CB-BH-004",
      "asset_type": "电缆分支箱",
      "feeder_line": "10kV北环线",
      "voltage_level": "10kV",
      "location_desc": "北环路地下管廊B段",
      "health_status": "DEGRADED",
      "owner_team_id": 3
    },
    {
      "id": 5,
      "asset_code": "TR-JB-005",
      "asset_type": "配电变压器",
      "feeder_line": "10kV江边线",
      "voltage_level": "10kV",
      "location_desc": "江边路码头台区",
      "health_status": "NORMAL",
      "owner_team_id": 2
    }
  ],
  "faultReport": [
    {
      "id": 1,
      "reporter_name": "王建国",
      "phone": "13800000001",
      "asset_id": 1,
      "fault_type": "VOLTAGE_LOW",
      "address_desc": "迎春路12号台区电压偏低",
      "severity": "一般",
      "report_channel": "95598热线",
      "status": "RESTORED"
    },
    {
      "id": 2,
      "reporter_name": "李秀兰",
      "phone": "13800000002",
      "asset_id": 2,
      "fault_type": "TRIP",
      "address_desc": "纬三路环网柜跳闸",
      "severity": "紧急",
      "report_channel": "调度告警",
      "status": "DISPATCHED"
    },
    {
      "id": 3,
      "reporter_name": "张强",
      "phone": "13800000003",
      "asset_id": 3,
      "fault_type": "EQUIPMENT_DAMAGE",
      "address_desc": "石桥村柱上开关烧毁",
      "severity": "紧急",
      "report_channel": "95598热线",
      "status": "DISPATCHED"
    },
    {
      "id": 4,
      "reporter_name": "刘敏",
      "phone": "13800000004",
      "asset_id": 3,
      "fault_type": "VOLTAGE_LOW",
      "address_desc": "石桥村台区末端电压低",
      "severity": "一般",
      "report_channel": "掌上电力",
      "status": "OPEN"
    },
    {
      "id": 5,
      "reporter_name": "陈冬",
      "phone": "13800000005",
      "asset_id": 5,
      "fault_type": "VOLTAGE_LOW",
      "address_desc": "码头台区夜间电压低",
      "severity": "一般",
      "report_channel": "营业厅",
      "status": "DISPATCHED"
    }
  ],
  "repairTicket": [
    {
      "id": 1,
      "fault_report_id": 1,
      "team_id": 1,
      "dispatcher_id": 1,
      "priority": "P3",
      "status": "RESTORED",
      "assigned_at": "2026-10-05T08:30:00Z",
      "restored_at": "2026-10-05T11:20:00Z"
    },
    {
      "id": 2,
      "fault_report_id": 2,
      "team_id": 2,
      "dispatcher_id": 1,
      "priority": "P1",
      "status": "REPAIRING",
      "assigned_at": "2026-10-07T01:10:00Z",
      "restored_at": null
    },
    {
      "id": 3,
      "fault_report_id": 3,
      "team_id": 1,
      "dispatcher_id": 2,
      "priority": "P1",
      "status": "ASSIGNED",
      "assigned_at": "2026-10-07T02:40:00Z",
      "restored_at": null
    },
    {
      "id": 4,
      "fault_report_id": 5,
      "team_id": 3,
      "dispatcher_id": 2,
      "priority": "P3",
      "status": "WAIT_DISPATCH",
      "assigned_at": null,
      "restored_at": null
    }
  ],
  "crew": [
    {
      "id": 1,
      "name": "name 1",
      "leader_id": 1,
      "skill_tags": "skill tags 1",
      "duty_status": "ASSIGNED",
      "current_ticket_id": 1,
      "contact_phone": "13800000001"
    },
    {
      "id": 2,
      "name": "name 2",
      "leader_id": 2,
      "skill_tags": "skill tags 2",
      "duty_status": "ARRIVED",
      "current_ticket_id": 2,
      "contact_phone": "13800000002"
    },
    {
      "id": 3,
      "name": "name 3",
      "leader_id": 3,
      "skill_tags": "skill tags 3",
      "duty_status": "WAIT_DISPATCH",
      "current_ticket_id": 3,
      "contact_phone": "13800000003"
    }
  ],
  "sparePartUsage": [
    {
      "id": 1,
      "ticket_id": 1,
      "part_code": "part code 1",
      "part_name": "part name 1",
      "quantity": 92,
      "warehouse_name": "warehouse name 1",
      "approved_by": "approved by 1",
      "usage_status": "ASSIGNED"
    },
    {
      "id": 2,
      "ticket_id": 2,
      "part_code": "part code 2",
      "part_name": "part name 2",
      "quantity": 104,
      "warehouse_name": "warehouse name 2",
      "approved_by": "approved by 2",
      "usage_status": "ARRIVED"
    },
    {
      "id": 3,
      "ticket_id": 3,
      "part_code": "part code 3",
      "part_name": "part name 3",
      "quantity": 116,
      "warehouse_name": "warehouse name 3",
      "approved_by": "approved by 3",
      "usage_status": "WAIT_DISPATCH"
    }
  ]
} as const;
