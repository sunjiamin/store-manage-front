<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="类别名" prop="className">
                <Input type="text" v-model="searchForm.className" clearable placeholder="请输入用户名" style="width: 200px"/>
              </Form-item>
              <Form-item label="类别编码" prop="classCode">
                <Input type="text" v-model="searchForm.classCode" clearable placeholder="请输入手机号" style="width: 200px"/>
              </Form-item>
              <span v-if="drop">
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
            <Button @click="addClass" type="primary" icon="plus-round">添加配件分类</Button>
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
                  @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,100,9999999]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal :title="modalTitle" v-model="classModalVisible" :mask-closable='false' :width="600">
      <Form ref="classFrom" :model="classFrom" :label-width="80" :rules="classFromValidate">
        <FormItem label="类别名" prop="className">
          <Input v-model="classFrom.className"/>
        </FormItem>
        <FormItem label="类别编码" prop="classCode"  >
          <Input  v-model="classFrom.classCode"/>
        </FormItem>

        <FormItem label="备注" prop="remark">
          <Input v-model="classFrom.remark"/>
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
    name: "product-class",
    data() {
      return {
        loading: true,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "chevron-down",
        selectCount: 0,
        selectList: [],
        searchForm: {
          className: "",
          classCode: "",
          status: "",
          remark:"",
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
        classFrom: {

        },
        classRoles: [],
        roleList: [],
        errorPass: "",
        classFromValidate: {
          className: [
            { required: true, message: "类别名不能为空", trigger: "blur" }
          ],
          classCode: [
            { required: true, message: "类别编码不能为空", trigger: "blur" }
          ],
          remark: [
            { required: true, message: "类别备注不能为空", trigger: "blur" }
          ]
        },
        submitLoading: false,
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "类别名",
            key: "className",

            sortable: true
          },
          {
            title: "类别编码",
            key: "classCode",
            sortable: true
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
            width: 260,
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
        this.getRequest("/productClass/getByCondition", this.searchForm).then(res => {
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
                filename: "配件分类数据."+util.getCurrentDatetime2()
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
        this.$refs.classFrom.validate(valid => {
          if (valid) {
            let url = "/productClass/add";
            if (this.modalType === 1) {
              // 编辑用户
              url = "/productClass/edit";
            }else{
              delete this.classFrom.id;
              url = "/productClass/add";
            }

            this.submitLoading = true;
            this.postRequest(url, this.classFrom).then(res => {
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
        this.modalTitle = "添加配件类别";
        this.$refs.classFrom.resetFields();
        this.classModalVisible = true;
      },
      edit(v) {
        this.modalType = 1;
        this.modalTitle = "编辑配件类别";
        this.$refs.classFrom.resetFields();
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let classInfo = JSON.parse(str);
        this.classFrom = classInfo;

        this.classModalVisible = true;
      } ,
      remove(v) {
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除配件 " + v.className + " ?",
          onOk: () => {
            this.deleteRequest("/productClass/delByIds", { ids: v.id }).then(res => {
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
            this.deleteRequest("/productClass/delByIds", { ids: ids }).then(res => {
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
  @import "./productClass.less";
</style>
