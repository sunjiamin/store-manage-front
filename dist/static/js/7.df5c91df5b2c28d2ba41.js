webpackJsonp([7],{"5aL4":function(s,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=t("mvHQ"),r=t.n(a),o=t("lbHh"),i=t.n(o),n={name:"change_pass",data:function(){var s=this;return{id:"",savePassLoading:!1,editPasswordForm:{oldPass:"",newPass:"",rePass:""},passwordValidate:{oldPass:[{required:!0,message:"请输入原密码",trigger:"blur"}],newPass:[{required:!0,message:"请输入新密码",trigger:"blur"},{min:6,message:"请至少输入6个字符",trigger:"blur"},{max:32,message:"最多输入32个字符",trigger:"blur"}],rePass:[{required:!0,message:"请再次输入新密码",trigger:"blur"},{validator:function(e,t,a){t!==s.editPasswordForm.newPass?a(new Error("两次输入密码不一致")):a()},trigger:"blur"}]}}},methods:{init:function(){var s=JSON.parse(i.a.get("userInfo"));this.id=s.id},saveEditPass:function(){var s=this,e={id:this.id,password:this.editPasswordForm.oldPass,newPass:this.editPasswordForm.newPass};this.$refs.editPasswordForm.validate(function(t){t&&(s.savePassLoading=!0,s.postRequest("/user/modifyPass",e).then(function(e){s.savePassLoading=!1,!0===e.success&&s.$Modal.success({title:"修改密码成功",content:"修改密码成功，需重新登录",onOk:function(){s.$store.commit("logout",s),s.$store.commit("clearOpenedSubmenu"),s.$router.push({name:"login"})}})}))})},cancelEditPass:function(){this.$store.commit("removeTag","change_pass"),localStorage.pageOpenedList=r()(this.$store.state.app.pageOpenedList);var s="";s=this.$store.state.app.pageOpenedList.length>1?this.$store.state.app.pageOpenedList[1].name:this.$store.state.app.pageOpenedList[0].name,this.$router.push({name:s})}},mounted:function(){this.init()}},d={render:function(){var s=this,e=s.$createElement,t=s._self._c||e;return t("div",[t("Card",[t("p",{attrs:{slot:"title"},slot:"title"},[t("Icon",{attrs:{type:"key"}}),s._v("\n            修改密码\n        ")],1),s._v(" "),t("div",[t("Form",{ref:"editPasswordForm",staticStyle:{width:"450px"},attrs:{model:s.editPasswordForm,"label-width":100,"label-position":"right",rules:s.passwordValidate}},[t("FormItem",{attrs:{label:"原密码",prop:"oldPass"}},[t("Input",{attrs:{type:"password",placeholder:"请输入现在使用的密码"},model:{value:s.editPasswordForm.oldPass,callback:function(e){s.$set(s.editPasswordForm,"oldPass",e)},expression:"editPasswordForm.oldPass"}})],1),s._v(" "),t("FormItem",{attrs:{label:"新密码",prop:"newPass"}},[t("Input",{attrs:{type:"password",placeholder:"请输入新密码，至少6位字符"},model:{value:s.editPasswordForm.newPass,callback:function(e){s.$set(s.editPasswordForm,"newPass",e)},expression:"editPasswordForm.newPass"}})],1),s._v(" "),t("FormItem",{attrs:{label:"确认新密码",prop:"rePass"}},[t("Input",{attrs:{type:"password",placeholder:"请再次输入新密码"},model:{value:s.editPasswordForm.rePass,callback:function(e){s.$set(s.editPasswordForm,"rePass",e)},expression:"editPasswordForm.rePass"}})],1),s._v(" "),t("FormItem",[t("Button",{staticStyle:{width:"100px"},attrs:{type:"primary",loading:s.savePassLoading},on:{click:s.saveEditPass}},[s._v("保存")]),s._v(" "),t("Button",{attrs:{type:"ghost"},on:{click:s.cancelEditPass}},[s._v("取消")])],1)],1)],1)])],1)},staticRenderFns:[]};var l=t("VU/8")(n,d,!1,function(s){t("uxWz")},null,null);e.default=l.exports},uxWz:function(s,e){}});
//# sourceMappingURL=7.df5c91df5b2c28d2ba41.js.map