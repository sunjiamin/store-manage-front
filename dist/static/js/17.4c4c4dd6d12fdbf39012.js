webpackJsonp([17],{C6bD:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"search"},[s("Row",[s("Col",[s("Card",[s("Form",{staticClass:"search-form",attrs:{inline:"","label-width":70}},[s("Form-item",{attrs:{label:"搜索用户"}},[s("Input",{staticStyle:{width:"300px"},attrs:{type:"text",clearable:"",placeholder:"请输入搜索关键词"},model:{value:e.searchKey,callback:function(t){e.searchKey=t},expression:"searchKey"}})],1),e._v(" "),s("Form-item",{staticStyle:{"margin-left":"-35px"}},[s("Button",{attrs:{type:"primary",icon:"search"},on:{click:e.getOnlineUserList}},[e._v("搜索")]),e._v(" "),s("Button",{attrs:{type:"ghost"},on:{click:e.handleReset}},[e._v("重置")])],1)],1),e._v(" "),s("Row",[s("Alert",{attrs:{"show-icon":""}},[e._v("\n            已选择 "),s("span",{staticClass:"select-count"},[e._v(e._s(e.selectCount))]),e._v(" 项\n            "),s("a",{staticClass:"select-clear",on:{click:e.clearSelectAll}},[e._v("清空")])])],1),e._v(" "),s("Row",{staticClass:"margin-top-10 searchable-table-con1"},[s("Table",{ref:"table",attrs:{loading:e.loading,border:"",columns:e.columns,data:e.data,sortable:"custom"},on:{"on-sort-change":e.changeSort,"on-selection-change":e.changeSelect}})],1),e._v(" "),s("Row",{staticClass:"code-row-bg page",attrs:{type:"flex",justify:"end"}},[s("Page",{attrs:{current:this.pageNumber,total:e.total,"page-size":this.pageSize,"page-size-opts":[10,20,50,100],size:"small","show-total":"","show-elevator":"","show-sizer":""},on:{"on-change":e.changePage,"on-page-size-change":e.changePageSize}})],1)],1)],1)],1)],1)},staticRenderFns:[]};var a=s("VU/8")({name:"onlineUser",data:function(){var e=this;return{loading:!0,searchKey:"",selectList:[],selectCount:0,sortColumn:"userIp",sortType:"desc",columns:[{type:"selection",width:60,align:"center"},{title:"用户ID",key:"userId",sortable:!0},{title:"连接IP",key:"userIp",sortable:!0},{title:"连接客户端",key:"osName",sortable:!0},{title:"用户Tag",key:"userTag",sortable:!0},{title:"操作",key:"action",align:"center",render:function(t,s){return t("div",[t("Button",{props:{type:"error",size:"small"},on:{click:function(){e.killUser(s.row)}}},"下线")])}}],data:[],pageNumber:1,pageSize:10,total:0}},methods:{init:function(){this.getOnlineUserList()},changePage:function(e){this.pageNumber=e,this.getOnlineUserList()},changePageSize:function(e){this.pageSize=e,this.getOnlineUserList()},getOnlineUserList:function(){this.loading=!0,this.searchKey,this.pageNumber,this.pageSize,this.sortColumn,this.sortType,this.data=[{userId:"00001",userIp:"127.0.0.1",osName:"IOS",userTag:"jojo"},{userId:"00002",userIp:"127.0.0.1",osName:"Android",userTag:"jojo"},{userId:"00003",userIp:"127.0.0.1",osName:"IOS",userTag:"jojo"}],this.loading=!1,this.total="3"},handleReset:function(){this.searchKey="",this.getOnlineUserList()},killUser:function(e){var t=this;this.$Modal.confirm({title:"确认踢除",content:"您确认要踢除"+e.userId+"吗？",onOk:function(){t.$Message.success("踢除成功"),t.init()}})},clearSelectAll:function(){this.$refs.table.selectAll(!1)},changeSelect:function(e){this.selectList=e,this.selectCount=e.length},changeSort:function(e){this.sortColumn=e.key,this.sortType=e.order,"normal"===e.order&&(this.sortType=""),this.getOnlineUserList()}},mounted:function(){this.init()}},n,!1,function(e){s("S8wT")},null,null);t.default=a.exports},S8wT:function(e,t){}});
//# sourceMappingURL=17.4c4c4dd6d12fdbf39012.js.map