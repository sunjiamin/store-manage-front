<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="姓名" prop="className">
                <Input type="text" v-model="searchForm.userName" clearable placeholder="请输入姓名" style="width: 200px"/>
              </Form-item>
              <Form-item label="手机号" prop="classCode">
                <Input type="text" v-model="searchForm.mobile" clearable placeholder="请输入手机号" style="width: 200px"/>
              </Form-item>
              <span v-if="drop">
                    <Form-item label="性别" prop="sex">
                      <Select v-model="searchForm.sex" placeholder="请选择" clearable style="width: 200px">
                        <Option value="0">女</Option>
                        <Option value="1">男</Option>
                      </Select>
                    </Form-item>
                    <Form-item label="创建时间" prop="status">
                      <DatePicker type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
                    </Form-item>
              </span>
              <Form-item style="margin-left:-35px;">
                <Button @click="handleSearch" type="primary" icon="search">搜索</Button>
                <Button @click="handleReset" type="ghost" >重置</Button>
                <a class="drop-down" @click="dropDown">{{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="addClass" type="primary" icon="plus-round">添加销售员</Button>
            <Button @click="delAll" type="ghost" icon="trash-a">批量删除</Button>
            <Dropdown @on-click="handleDropdown">
              <Button type="ghost">
                更多操作
                <Icon type="arrow-down-b"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="refresh">刷新</DropdownItem>
                <DropdownItem name="exportData">导出所选数据</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row class="margin-top-10 searchable-table-con1">
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
            <Table :columns="columns" :data="exportData" ref="exportTable" style="display:none"></Table>
          </Row>
          <Row type="flex" justify="end" class="code-row-bg page">
            <Page :current="this.searchForm.pageNumber" :total="total" :page-size="this.searchForm.pageSize"
                  @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[2,10,20,50,100,9999999]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal :title="modalTitle" v-model="classModalVisible" :mask-closable='false' :width="600">
      <Form ref="salePersonFrom" :model="salePersonFrom" :label-width="80" :rules="salePersonFromValidate">
        <FormItem label="用户名" prop="userName">
          <Input v-model="salePersonFrom.userName"/>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="salePersonFrom.mobile"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="salePersonFrom.email"/>
        </FormItem>

        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="salePersonFrom.sex">
            <Radio :label="1">男</Radio>
            <Radio :label="0">女</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="备注" prop="remark">
          <Input v-model="salePersonFrom.remark"/>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelClass">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitClass">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import util from "@/libs/util.js";
  export default {
    components:{
      util
    },
    name: "salePerson",
    data() {
      const validateMobile = (rule, value, callback) => {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(value)) {
          callback(new Error("手机号格式错误"));
        } else {
          callback();
        }
      };
      return {
        loading: true,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "chevron-down",
        selectCount: 0,
        selectList: [],
        searchForm: {
          userName: "",
          mobile: "",
          email: "",
          sex: "",
          pageNumber: 1,
          pageSize: 10,
          sort: "createTime",
          order: "desc",
          startDate: "",
          endDate: ""
        },
        modalType: 0,
        classModalVisible: false,
        modalTitle: "",
        salePersonFrom: {
          sex: 1,
        },
        classRoles: [],
        roleList: [],
        errorPass: "",
        salePersonFromValidate: {
          userName: [
            { required: true, message: "用户名不能为空", trigger: "blur" }
          ],
          mobile: [
            { required: true, message: "手机号不能为空", trigger: "blur" },
            { validator: validateMobile, trigger: "blur" }
          ],

        },
        submitLoading: false,
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed:"left",
          },
          {
            title: "销售员名称",
            key: "userName",
            width: 150,
            sortable: true
          },
          {
            title: "手机",
            key: "mobile",
            width: 150,
            sortable: true
          },
          {
            title: "邮箱",
            key: "email",
            width: 200,
            sortable: true
          },
          {
            title: "性别",
            key: "sex",
            width: 70,
            align: "center",
            render: (h, params) => {
              let re = "";
              if (params.row.sex === 1) {
                re = "男";
              } else if (params.row.sex === 0) {
                re = "女";
              }
              return h("div", re);
            }
          },
          {
            title: "备注",
            key: "remark",
            sortable: true
          },
          {
            title: "创建时间",
            key: "createTime",
            sortable: true,
            sortType: "desc",

          },
          {
            title: "操作",
            key: "action",
            width: 220,
            fixed:"right",
            align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
                  },
                  "编辑"
                ) ,
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.remove(params.row);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        ],
        data: [],
        exportData: [],
        total: 0
      };
    },
    methods: {
      init() {
        this.getClassList();
      },
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getClassList();
      },
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getClassList();
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      getClassList() {
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/salePerson/getByCondition", this.searchForm).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.data = res.result.content;
            this.total = res.result.totalElements;
          }
        });
      },
      handleSearch() {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.init();
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        // 重新加载数据
        this.init();
      },
      changeSort(e) {
        this.searchForm.sort = e.key;
        this.searchForm.order = e.order;
        if (e.order === "normal") {
          this.searchForm.order = "";
        }
        this.init();
      },
      handleDropdown(name) {
        if (name === "exportData") {
          if (this.selectCount <= 0) {
            this.$Message.warning("您还未选择要导出的数据");
            return;
          }
          this.$Modal.confirm({
            title: "确认导出",
            content: "您确认要导出所选 " + this.selectCount + " 条数据?",
            onOk: () => {
              this.$refs.exportTable.exportCsv({
                filename: "销售员数据."+util.getCurrentDatetime2()
              });
            }
          });
        } else if (name === "refresh") {
          this.getClassList();
        }
      },
      selectRoles(v) {},
      cancelClass() {
        this.classModalVisible = false;
      },
      submitClass() {
        this.$refs.salePersonFrom.validate(valid => {
          if (valid) {
            let url = "/salePerson/add";
            if (this.modalType === 1) {
              // 编辑用户
              url = "/salePerson/edit";
            }else{
              delete this.salePersonFrom.id;
              url = "/salePerson/add";
            }

            this.submitLoading = true;
            this.postRequest(url, this.salePersonFrom).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.init();
                this.classModalVisible = false;
              }
            });
          }
        });
      },
      addClass() {
        this.modalType = 0;
        this.modalTitle = "添加销售员";
        this.$refs.salePersonFrom.resetFields();
        this.classModalVisible = true;
      },
      edit(v) {
        this.modalType = 1;
        this.modalTitle = "编辑销售员";
        this.$refs.salePersonFrom.resetFields();
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let classInfo = JSON.parse(str);
        this.salePersonFrom = classInfo;

        this.classModalVisible = true;
      } ,
      remove(v) {
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除销售员 " + v.userName + " ?",
          onOk: () => {
            this.deleteRequest("/salePerson/delByIds", { ids: v.id }).then(res => {
              if (res.success === true) {
                this.$Message.success("删除成功");
                this.init();
              }
            });
          }
        });
      },
      dropDown() {
        if (this.drop) {
          this.dropDownContent = "展开";
          this.dropDownIcon = "chevron-down";
        } else {
          this.dropDownContent = "收起";
          this.dropDownIcon = "chevron-up";
        }
        this.drop = !this.drop;
      },
      showSelect(e) {
        this.exportData = e;
        this.selectList = e;
        this.selectCount = e.length;
      },
      clearSelectAll() {
        this.$refs.table.selectAll(false);
      },
      delAll() {
        if (this.selectCount <= 0) {
          this.$Message.warning("您还未选择要删除的数据");
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
            this.deleteRequest("/salePerson/delByIds", { ids: ids }).then(res => {
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
</script>

<style scoped>
  @import "./salePerson.less";
</style>
