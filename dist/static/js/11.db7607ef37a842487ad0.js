webpackJsonp([11],{"1tUB":function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});e("lbHh");var a={name:"access_index",data:function(){return{buttonTypes:[],example:"<Button v-hasButton=\"'add'\">添加按钮</Button>"}},computed:{avatorPath:function(){return localStorage.avatorImgPath}},methods:{initMeta:function(){var t=this.$route.meta.buttonTypes;null!==t&&void 0!==t&&(this.buttonTypes=t)}},created:function(){this.initMeta()}},n={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"access"},[e("Row",[e("Col",{attrs:{span:"8"}},[e("Card",[e("p",{attrs:{slot:"title"},slot:"title"},[e("Icon",{attrs:{type:"android-contact"}}),t._v("\n                    当前用户\n                ")],1),t._v(" "),e("div",{staticClass:"access-user-con access-current-user-con"},[e("img",{attrs:{src:t.avatorPath,alt:""}}),t._v(" "),e("p",[t._v("当前用户本页面拥有按钮权限:")]),t._v(" "),e("b",[t._v(t._s(t.buttonTypes))])])])],1),t._v(" "),e("Col",{staticClass:"padding-left-10",attrs:{span:"16"}},[e("Card",[e("p",{attrs:{slot:"title"},slot:"title"},[e("Icon",{attrs:{type:"android-contacts"}}),t._v("\n                    当前用户本页面拥有的按钮操作\n                ")],1),t._v(" "),e("div",{staticClass:"access-user-con access-change-access-con"},[e("Col",{staticClass:"buttons",attrs:{span:"4"}},[e("Row",{staticClass:"access-change-access-con-row",attrs:{type:"flex",justify:"center",align:"middle"}},[e("Button",{directives:[{name:"hasButton",rawName:"v-hasButton",value:"add",expression:"'add'"}],attrs:{type:"primary"}},[t._v("添加按钮")]),t._v(" "),e("Button",{directives:[{name:"hasButton",rawName:"v-hasButton",value:"edit",expression:"'edit'"}],attrs:{type:"ghost"}},[t._v("编辑按钮")]),t._v(" "),e("Button",{directives:[{name:"hasButton",rawName:"v-hasButton",value:"delete",expression:"'delete'"}],attrs:{type:"error"}},[t._v("删除按钮")])],1)],1),t._v(" "),e("Col",{staticClass:"padding-left-10",attrs:{span:"16"}},[e("Row",{staticClass:"access-change-access-con-row",attrs:{type:"flex",justify:"center",align:"middle"}},[e("p",[t._v("\n                                您可以通过更换测试用户账号：test或test2 密码：123456，然后观察该页面此处按钮的变化"),e("br"),e("br"),t._v('\n                                自定义权限按钮标签："v-hasButton"，示例：'+t._s(t.example)),e("br"),e("br"),t._v("\n                                其他页面为演示功能，前台未配置隐藏权限按钮\n                            ")])])],1)],1)])],1)],1)],1)},staticRenderFns:[]};var c=e("VU/8")(a,n,!1,function(t){e("y3Sd"),e("Zjj6")},null,null);s.default=c.exports},Zjj6:function(t,s){},y3Sd:function(t,s){}});
//# sourceMappingURL=11.db7607ef37a842487ad0.js.map