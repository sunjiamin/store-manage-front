webpackJsonp([14],{If12:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=o("mvHQ"),r=o.n(s),a={name:"product",data:function(){var t=this;return{loading:!0,drop:!1,dropDownContent:"展开",dropDownIcon:"chevron-down",selectCount:0,selectList:[],searchForm:{productName:"",productCode:"",productSpec:"",productClass:"",supplierId:"",brandId:"",pageNumber:1,pageSize:10,sort:"createTime",order:"desc",startDate:"",endDate:""},modalType:0,userModalVisible:!1,modalTitle:"",productForm:{},userRoles:[],productClassList:[],errorPass:"",productFormValidate:{},submitLoading:!1,columns:[{type:"selection",width:60,align:"center"},{title:"配件名称",key:"productName",width:150,sortable:!0},{title:"配件代码",key:"productCode",width:110,sortable:!0},{title:"规格",key:"productSpec",width:200,sortable:!0},{title:"类别",key:"productClass",width:200,sortable:!0},{title:"供应商",key:"supplierId",width:200,sortable:!0},{title:"品牌名",key:"brandId",width:200,sortable:!0},{title:"创建时间",key:"createTime",sortable:!0,sortType:"desc",width:150},{title:"操作",key:"action",width:260,align:"center",render:function(e,o){return 0===o.row.status?e("div",[e("Button",{props:{type:"primary",size:"small"},style:{marginRight:"5px"},on:{click:function(){t.edit(o.row)}}},"编辑"),e("Button",{props:{type:"ghost",size:"small"},style:{marginRight:"5px"},on:{click:function(){t.disable(o.row)}}},"禁用"),e("Button",{props:{type:"error",size:"small"},on:{click:function(){t.remove(o.row)}}},"删除")]):e("div",[e("Button",{props:{type:"primary",size:"small"},style:{marginRight:"5px"},on:{click:function(){t.edit(o.row)}}},"编辑"),e("Button",{props:{type:"success",size:"small"},style:{marginRight:"5px"},on:{click:function(){t.enable(o.row)}}},"启用"),e("Button",{props:{type:"error",size:"small"},on:{click:function(){t.remove(o.row)}}},"删除")])}}],data:[],exportData:[],total:0}},methods:{init:function(){this.getProductList()},changePage:function(t){this.searchForm.pageNumber=t,this.getProductList()},changePageSize:function(t){this.searchForm.pageSize=t,this.getProductList()},selectDateRange:function(t){t&&(this.searchForm.startDate=t[0],this.searchForm.endDate=t[1])},getProductList:function(){var t=this;this.loading=!0,this.postRequest("/product/getByCondition",this.searchForm).then(function(e){t.loading=!1,!0===e.success&&(t.data=e.result.content,t.total=e.result.totalElements)})},handleSearch:function(){this.searchForm.pageNumber=1,this.searchForm.pageSize=10,this.init()},handleReset:function(){this.$refs.searchForm.resetFields(),this.searchForm.pageNumber=1,this.searchForm.pageSize=10,this.init()},changeSort:function(t){this.searchForm.sort=t.key,this.searchForm.order=t.order,"normal"===t.order&&(this.searchForm.order=""),this.init()},getProductClassList:function(){var t=this;this.getRequest("/productClass/getAllList").then(function(e){!0===e.success&&(t.productClassList=e.result)})},handleDropdown:function(t){var e=this;if("exportData"===t){if(this.selectCount<=0)return void this.$Message.warning("您还未选择要导出的数据");this.$Modal.confirm({title:"确认导出",content:"您确认要导出所选 "+this.selectCount+" 条数据?",onOk:function(){e.$refs.exportTable.exportCsv({filename:"用户数据"})}})}else"refresh"===t&&this.getUserList()},selectProductClass:function(t){},cancelUser:function(){this.userModalVisible=!1},submitProduct:function(){var t=this;this.$refs.productForm.validate(function(e){if(e){var o="/product/add";1===t.modalType&&(o="/product/edit"),t.submitLoading=!0,t.postRequest(o,t.productForm).then(function(e){t.submitLoading=!1,!0===e.success&&(t.$Message.success("操作成功"),t.init(),t.userModalVisible=!1)})}})},addUser:function(){this.modalType=0,this.modalTitle="添加用户",this.$refs.productForm.resetFields(),this.userModalVisible=!0},edit:function(t){for(var e in this.modalType=1,this.modalTitle="编辑用户",this.$refs.productForm.resetFields(),t)null===t[e]&&(t[e]="");var o=r()(t),s=JSON.parse(o);this.productForm=s;var a=[];this.productForm.roles.forEach(function(t){a.push(t.id)}),this.productForm.roles=a,this.userModalVisible=!0},enable:function(t){var e=this;this.$Modal.confirm({title:"确认启用",content:"您确认要启用用户 "+t.username+" ?",onOk:function(){e.postRequest("/user/admin/enable/"+t.id).then(function(t){!0===t.success&&(e.$Message.success("操作成功"),e.init())})}})},disable:function(t){var e=this;this.$Modal.confirm({title:"确认禁用",content:"您确认要禁用用户 "+t.username+" ?",onOk:function(){e.postRequest("/user/admin/disable/"+t.id).then(function(t){!0===t.success&&(e.$Message.success("操作成功"),e.init())})}})},remove:function(t){var e=this;this.$Modal.confirm({title:"确认删除",content:"您确认要删除用户 "+t.username+" ?",onOk:function(){e.deleteRequest("/user/delByIds",{ids:t.id}).then(function(t){!0===t.success&&(e.$Message.success("删除成功"),e.init())})}})},dropDown:function(){this.drop?(this.dropDownContent="展开",this.dropDownIcon="chevron-down"):(this.dropDownContent="收起",this.dropDownIcon="chevron-up"),this.drop=!this.drop},showSelect:function(t){this.exportData=t,this.selectList=t,this.selectCount=t.length},clearSelectAll:function(){this.$refs.table.selectAll(!1)},delAll:function(){var t=this;this.selectCount<=0?this.$Message.warning("您还未选择要删除的数据"):this.$Modal.confirm({title:"确认删除",content:"您确认要删除所选的 "+this.selectCount+" 条数据?",onOk:function(){var e="";t.selectList.forEach(function(t){e+=t.id+","}),e=e.substring(0,e.length-1),t.deleteRequest("/user/delByIds",{ids:e}).then(function(e){!0===e.success&&(t.$Message.success("删除成功"),t.init())})}})}},mounted:function(){this.init(),this.getProductClassList()}},i={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"search"},[o("Row",[o("Col",[o("Card",[o("Row",[o("Form",{ref:"searchForm",staticClass:"search-form",attrs:{model:t.searchForm,inline:"","label-width":70}},[o("Form-item",{attrs:{label:"配件名称",prop:"username"}},[o("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输入配件名称"},model:{value:t.searchForm.username,callback:function(e){t.$set(t.searchForm,"username",e)},expression:"searchForm.username"}})],1),t._v(" "),o("Form-item",{attrs:{label:"配件编码",prop:"mobile"}},[o("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输入配件编码"},model:{value:t.searchForm.mobile,callback:function(e){t.$set(t.searchForm,"mobile",e)},expression:"searchForm.mobile"}})],1),t._v(" "),t.drop?o("span",[o("Form-item",{attrs:{label:"邮箱",prop:"email"}},[o("Input",{staticStyle:{width:"200px"},attrs:{type:"text",clearable:"",placeholder:"请输入邮箱"},model:{value:t.searchForm.email,callback:function(e){t.$set(t.searchForm,"email",e)},expression:"searchForm.email"}})],1),t._v(" "),o("Form-item",{attrs:{label:"性别",prop:"sex"}},[o("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择",clearable:""},model:{value:t.searchForm.sex,callback:function(e){t.$set(t.searchForm,"sex",e)},expression:"searchForm.sex"}},[o("Option",{attrs:{value:"0"}},[t._v("女")]),t._v(" "),o("Option",{attrs:{value:"1"}},[t._v("男")])],1)],1),t._v(" "),o("Form-item",{attrs:{label:"用户类型",prop:"type"}},[o("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择",clearable:""},model:{value:t.searchForm.type,callback:function(e){t.$set(t.searchForm,"type",e)},expression:"searchForm.type"}},[o("Option",{attrs:{value:"0"}},[t._v("普通用户")]),t._v(" "),o("Option",{attrs:{value:"1"}},[t._v("管理员")])],1)],1),t._v(" "),o("Form-item",{attrs:{label:"用户状态",prop:"status"}},[o("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择",clearable:""},model:{value:t.searchForm.status,callback:function(e){t.$set(t.searchForm,"status",e)},expression:"searchForm.status"}},[o("Option",{attrs:{value:"0"}},[t._v("正常")]),t._v(" "),o("Option",{attrs:{value:"-1"}},[t._v("禁用")])],1)],1),t._v(" "),o("Form-item",{attrs:{label:"创建时间",prop:"status"}},[o("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"daterange",format:"yyyy-MM-dd",clearable:"",placeholder:"选择起始时间"},on:{"on-change":t.selectDateRange}})],1)],1):t._e(),t._v(" "),o("Form-item",{staticStyle:{"margin-left":"-35px"}},[o("Button",{attrs:{type:"primary",icon:"search"},on:{click:t.handleSearch}},[t._v("搜索")]),t._v(" "),o("Button",{attrs:{type:"ghost"},on:{click:t.handleReset}},[t._v("重置")]),t._v(" "),o("a",{staticClass:"drop-down",on:{click:t.dropDown}},[t._v(t._s(t.dropDownContent)+"\n                "),o("Icon",{attrs:{type:t.dropDownIcon}})],1)],1)],1)],1),t._v(" "),o("Row",{staticClass:"operation"},[o("Button",{attrs:{type:"primary",icon:"plus-round"},on:{click:t.addUser}},[t._v("添加用户")]),t._v(" "),o("Button",{attrs:{type:"ghost",icon:"trash-a"},on:{click:t.delAll}},[t._v("批量删除")]),t._v(" "),o("Dropdown",{on:{"on-click":t.handleDropdown}},[o("Button",{attrs:{type:"ghost"}},[t._v("\n              更多操作\n              "),o("Icon",{attrs:{type:"arrow-down-b"}})],1),t._v(" "),o("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[o("DropdownItem",{attrs:{name:"refresh"}},[t._v("刷新")]),t._v(" "),o("DropdownItem",{attrs:{name:"exportData"}},[t._v("导出所选数据")])],1)],1)],1),t._v(" "),o("Row",[o("Alert",{attrs:{"show-icon":""}},[t._v("\n            已选择 "),o("span",{staticClass:"select-count"},[t._v(t._s(t.selectCount))]),t._v(" 项\n            "),o("a",{staticClass:"select-clear",on:{click:t.clearSelectAll}},[t._v("清空")])])],1),t._v(" "),o("Row",{staticClass:"margin-top-10 searchable-table-con1"},[o("Table",{ref:"table",attrs:{loading:t.loading,border:"",columns:t.columns,data:t.data,sortable:"custom"},on:{"on-sort-change":t.changeSort,"on-selection-change":t.showSelect}}),t._v(" "),o("Table",{ref:"exportTable",staticStyle:{display:"none"},attrs:{columns:t.columns,data:t.exportData}})],1),t._v(" "),o("Row",{staticClass:"code-row-bg page",attrs:{type:"flex",justify:"end"}},[o("Page",{attrs:{current:this.searchForm.pageNumber,total:t.total,"page-size":this.searchForm.pageSize,"page-size-opts":[10,20,50,100],size:"small","show-total":"","show-elevator":"","show-sizer":""},on:{"on-change":t.changePage,"on-page-size-change":t.changePageSize}})],1)],1)],1)],1),t._v(" "),o("Modal",{attrs:{title:t.modalTitle,"mask-closable":!1,width:500},model:{value:t.userModalVisible,callback:function(e){t.userModalVisible=e},expression:"userModalVisible"}},[o("Form",{ref:"productForm",attrs:{model:t.productForm,"label-width":70,rules:t.productFormValidate}},[o("FormItem",{attrs:{label:"配件名称",prop:"productName"}},[o("Input",{model:{value:t.productForm.productName,callback:function(e){t.$set(t.productForm,"productName",e)},expression:"productForm.productName"}})],1),t._v(" "),o("FormItem",{attrs:{label:"配件代码",prop:"productCode"}},[o("Input",{model:{value:t.productForm.productCode,callback:function(e){t.$set(t.productForm,"productCode",e)},expression:"productForm.productCode"}})],1),t._v(" "),o("FormItem",{attrs:{label:"配件规格",prop:"productSpec"}},[o("Input",{model:{value:t.productForm.productSpec,callback:function(e){t.$set(t.productForm,"productSpec",e)},expression:"productForm.productSpec"}})],1),t._v(" "),o("FormItem",{attrs:{label:"配件类别",prop:"roles"}},[o("Select",{on:{"on-change":t.selectProductClass},model:{value:t.productForm.productClass,callback:function(e){t.$set(t.productForm,"productClass",e)},expression:"productForm.productClass"}},t._l(t.productClassList,function(e){return o("Option",{key:e.id,attrs:{value:e.id}},[t._v(t._s(e.name))])}))],1),t._v(" "),o("FormItem",{attrs:{label:"配件备注",prop:"type"}},[o("Input",{model:{value:t.productForm.remark,callback:function(e){t.$set(t.productForm,"remark",e)},expression:"productForm.remark"}})],1)],1),t._v(" "),o("div",{attrs:{slot:"footer"},slot:"footer"},[o("Button",{attrs:{type:"text"},on:{click:t.cancelUser}},[t._v("取消")]),t._v(" "),o("Button",{attrs:{type:"primary",loading:t.submitLoading},on:{click:t.submitProduct}},[t._v("提交")])],1)],1)],1)},staticRenderFns:[]};var n=o("VU/8")(a,i,!1,function(t){o("ahAk")},"data-v-ac3ec4e6",null);e.default=n.exports},ahAk:function(t,e){}});
//# sourceMappingURL=14.c60e8b31e6b973aafb8e.js.map