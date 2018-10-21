export default {
  name: "menu-manage",
  data() {
    return {
      loading: true,
      expandAll: false,
      modalType: 0,
      menuModalVisible: false,
      selectList: [],
      selectCount: 0,
      showParent: false,
      isButtonAdd: false,
      isMenuAdd: false,
      isMenu: false,
      editStatus: true,
      addStatus: true,
      modalTitle: "",
      menuForm: {
        id: "",
        parentId: "",
        buttonType: "",
        type: 0,
        sortOrder: null,
        level: null,
        status: 0
      },
      menuFormAdd: {},
      menuFormValidate: {
        title: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        name: [{ required: true, message: "英文名不能为空", trigger: "blur" }],
        icon: [{ required: true, message: "图标不能为空", trigger: "blur" }],
        path: [{ required: true, message: "路径不能为空", trigger: "blur" }],
        component: [
          { required: true, message: "前端组件不能为空", trigger: "blur" }
        ]
      },
      submitLoading: false,
      data: []
    };
  },
  methods: {
    init() {
      this.getAllList();
    },
    handleDropdown(name) {
      if (name === "expandTwo") {
        this.expandAll = false;
        this.getAllList();
      } else if (name === "expandAll") {
        this.expandAll = true;
        this.getAllList();
      } else if (name === "refresh") {
        this.getAllList();
      }
    },
    getAllList() {
      this.loading = true;
      this.getRequest("/permission/getAllList").then(res => {
        this.loading = false;
        if (res.success === true) {
          // 仅展开2级
          if (!this.expandAll) {
            res.result.forEach(function(e) {
              if (e.children && e.children.length > 0) {
                e.children.forEach(function(c) {
                  if (c.level === 2) {
                    c.expand = false;
                  }
                });
              }
            });
          }
          this.data = res.result;
        }
      });
    },
    selectTree(v) {
      if (v.length > 0) {
        if (Number(v[0].level) === 1 || Number(v[0].level) === 2) {
          this.isMenu = true;
        } else {
          this.isMenu = false;
        }
        if (Number(v[0].status) === 0) {
          this.editStatus = true;
        } else {
          this.editStatus = false;
        }
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] === null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let menu = JSON.parse(str);
        if (menu.access === "") {
          menu.access = null;
        }
        this.menuForm = menu;
      }
    },
    cancelAdd() {
      this.menuModalVisible = false;
    },
    handleReset() {
      this.$refs.menuForm.resetFields();
    },
    changeEditSwitch(v) {
      if (v) {
        this.menuForm.status = 0;
      } else {
        this.menuForm.status = 1;
      }
    },
    submitEdit() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          if (!this.menuForm.id) {
            this.$Message.warning("请先点击选择要修改的菜单节点");
            return;
          }
          this.submitLoading = true;
          if (this.menuForm.sortOrder === null) {
            this.menuForm.sortOrder = "";
          }
          if (this.menuForm.buttonType === null) {
            this.menuForm.buttonType = "";
          }
          if (this.menuForm.type == 1) {
            this.menuForm.name = "";
            this.menuForm.icon = "";
            this.menuForm.component = "";
          }
          this.postRequest("/permission/edit", this.menuForm).then(res => {
            this.submitLoading = false;
            if (res.success === true) {
              this.$Message.success("编辑成功");
              this.init();
              this.menuModalVisible = false;
            }
          });
        }
      });
    },
    changeAddSwitch(v) {
      if (v) {
        this.menuFormAdd.status = 0;
      } else {
        this.menuFormAdd.status = 1;
      }
    },
    submitAdd() {
      this.$refs.menuFormAdd.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.menuFormAdd.sortOrder === null) {
            this.menuFormAdd.sortOrder = "";
          }
          if (this.menuFormAdd.buttonType === null) {
            this.menuFormAdd.buttonType = "";
          }
          if (this.menuFormAdd.type == 1) {
            this.menuForm.name = "";
            this.menuForm.icon = "";
            this.menuForm.component = "";
          }
          this.postRequest("/permission/add", this.menuFormAdd).then(res => {
            this.submitLoading = false;
            if (res.success === true) {
              this.$Message.success("添加成功");
              this.init();
              this.menuModalVisible = false;
            }
          });
        }
      });
    },
    addMenu() {
      if (this.menuForm.id == "" || this.menuForm.id == null) {
        this.$Message.warning("请先点击选择一个菜单权限节点");
        return;
      }
      this.modalTitle = "添加菜单权限";
      this.showParent = true;
      let type = 0;
      if (this.menuForm.level === 1) {
        type = 0;
        this.isMenuAdd = true;
        this.isButtonAdd = false;
      } else if (this.menuForm.level === 2) {
        type = 1;
        this.isMenuAdd = false;
        this.isButtonAdd = true;
      } else {
        type = 0;
        this.isMenuAdd = false;
        this.isButtonAdd = false;
      }
      this.menuFormAdd = {
        type: type,
        parentId: this.menuForm.id,
        level: Number(this.menuForm.level) + 1,
        sortOrder: 1,
        buttonType: "",
        status: 0
      };
      this.menuModalVisible = true;
    },
    addRootMenu() {
      this.modalTitle = "添加一级菜单";
      this.isMenuAdd = true;
      this.isButtonAdd = false;
      this.showParent = false;
      this.menuFormAdd = {
        type: 0,
        level: 1,
        sortOrder: 1,
        status: 0
      };
      this.menuModalVisible = true;
    },
    changeSelect(v) {
      this.selectCount = v.length;
      this.selectList = v;
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未勾选要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          this.deleteRequest("/permission/delByIds", { ids: ids }).then(res => {
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.init();
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
