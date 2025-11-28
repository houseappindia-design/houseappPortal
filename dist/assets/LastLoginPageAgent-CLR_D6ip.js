import{t as l,q as p,r as f,x as g,j as e,bz as c}from"./index-CfVxbtSE.js";import{S as x}from"./index-0bLpuKAD.js";import{A as y}from"./index-B5HyOzdZ.js";import{F as h}from"./Table-CrVbExSL.js";import{A as u}from"./index-BuhbxWHt.js";import{T as i}from"./index-NnmygcMd.js";import"./button-C5_Hdfhk.js";import"./ExclamationCircleFilled-C_flDW-8.js";import"./InfoCircleFilled-B5DrW48x.js";import"./BaseInput-UAXxaOaj.js";import"./styleChecker-jUO8vhoa.js";import"./addEventListener-CtglvHnr.js";import"./index-Ca2fJ2Be.js";import"./useBreakpoint-DahyjXEM.js";import"./LeftOutlined-Ox-gq8LW.js";import"./EllipsisOutlined-BDdOVdji.js";import"./Pagination-DQ3OUtW1.js";import"./Input-CpVgZGc3.js";import"./getAllowClear-Uyr8yb_4.js";import"./TextArea-D1eH27Bs.js";const K=()=>{const r=l(),{loading:n,error:o,todayAgentLogin:d}=p(t=>t.notifications);f.useEffect(()=>{r(g())},[r]);const s=(d||[]).filter(t=>t.agentName&&t.agentEmail&&t.agentPhone&&t.agencyName),m=[{title:"Profile",dataIndex:"agentProfile",key:"agentProfile",width:80,render:()=>e.jsx(u,{src:"/default-agent.png",icon:e.jsx(c,{}),style:{backgroundColor:"#e6f7ff",color:"#1677ff"}})},{title:"Agent Name",dataIndex:"agentName",key:"agentName",render:t=>e.jsx(i.Text,{strong:!0,style:{fontSize:15},children:t})},{title:"Email",dataIndex:"agentEmail",key:"agentEmail"},{title:"Phone Number",dataIndex:"agentPhone",key:"agentPhone",render:t=>e.jsx(i.Text,{style:{color:"#1677ff",fontWeight:500},children:t})},{title:"Agency Name",dataIndex:"agencyName",key:"agencyName"},{title:"Login Time",dataIndex:"login_time",key:"login_time",render:t=>new Date(t).toLocaleString(),sorter:(t,a)=>new Date(t.login_time)-new Date(a.login_time),defaultSortOrder:"descend"}];return e.jsxs("div",{children:[n&&e.jsx(x,{}),o&&e.jsx(y,{type:"error",message:o}),!n&&!o&&e.jsx(h,{columns:m,dataSource:s.map((t,a)=>({...t,key:a})),pagination:!1,bordered:!1,rowKey:"agentId",style:{borderRadius:12,overflow:"hidden",boxShadow:"0 4px 15px rgba(0,0,0,0.08)",background:"#fff",marginTop:10}}),e.jsx("style",{children:`
          .ant-table-thead > tr > th {
            background: #f0f2f5 !important;
            font-weight: 600 !important;
            padding: 14px !important;
            font-size: 14px;
            color: #333;
          }

          .ant-table-tbody > tr > td {
            padding: 14px !important;
            font-size: 14px;
          }

          .ant-table-tbody > tr:hover > td {
            background: #f9fafc !important;
          }
        `})]})};export{K as default};
