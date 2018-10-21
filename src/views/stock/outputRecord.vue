<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="支付状态" prop="type">
                <Select v-model="searchForm.payStatus" placeholder="请选择" clearable style="width: 200px">
                  <Option value="">全部</Option>
                  <Option value="1">收款完成</Option>
                  <Option value="2">部分收款</Option>
                  <Option value="3">未收款</Option>
                </Select>
              </Form-item>
              <Form-item label="创建时间" prop="status">
                <DatePicker type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
              </Form-item>

              <Form-item style="margin-left:-35px;">
                <Button @click="handleSearch" type="primary" icon="search">搜索</Button>
                <Button @click="handleReset" type="ghost" >重置</Button>

              </Form-item>
            </Form>
          </Row>

          <Row class="operation">

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

    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' :width="600">
      <Form ref="outputWarehouseDetailFrom" :model="outputWarehouseDetailFrom" :label-width="90"  >


        <FormItem label="收款状态" prop="status">
          <RadioGroup v-model="outputWarehouseDetailFrom.payStatus">
            <Radio :label="1">收款完成</Radio>
            <Radio :label="2">部分收款</Radio>
            <Radio :label="3">未收款</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="未到账金额" prop="price" >
          <Input   v-model="outputWarehouseDetailFrom.nopayAmount"/>
        </FormItem>

        <FormItem label="附加费" prop="price" >
          <Input   v-model="outputWarehouseDetailFrom.surcharge"/>
        </FormItem>

        <FormItem label="出库备注" prop="remark">
          <Input v-model="outputWarehouseDetailFrom.remark"/>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUpdate">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUpdateRecord">提交</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  export default {
    name: "outputWarehouseDetail",
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
          productName: "",
          pageNumber: 1,
          pageSize: 10,
          sort: "createTime",
          order: "desc",
          startDate: "",
          endDate: ""
        },
        modalType: 0,
        modalVisible: false,
        modalTitle: "",
        outputWarehouseDetailFrom: {

        },
        classRoles: [],
        roleList: [],
        errorPass: "",

        submitLoading: false,
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed: "left"
          },
          {
            title: "收款状态",
            key: "payStatus",
            fixed: "left",
            width: 110,
            render: (h, params) => {
              let re = "";//1收款完成  2部分收款  3未收款
              if (params.row.payStatus === 1) {
                return h("div", [
                  h(
                    "Tag",
                    {
                      props: {
                        color: "green"
                      }
                    },
                    "收款完成"
                  )
                ]);
              } else if (params.row.payStatus === 2) {
                return h("div", [
                  h(
                    "Tag",
                    {
                      props: {
                        color: "red"
                      }
                    },
                    "部分收款"
                  )
                ]);
              }else if (params.row.payStatus === 3) {
                return h("div", [
                  h(
                    "Tag",
                    {
                      props: {
                        color: "red"
                      }
                    },
                    "未收款"
                  )
                ]);
              }
            }
          },
          {
            title: "未收账金额",
            key: "nopayAmount",
            width: 130,
            fixed: "left",
            sortable: true,
            render: (h, params) => {
              let re = "";//1收款完成  2部分收款  3未收款
              if (params.row.nopayAmount <= 0 ) {
                return   h("div", params.row.nopayAmount);
              } else {
                return h("div", [
                  h(
                    "Tag",
                    {
                      props: {
                        color: "red"
                      }
                    },
                    params.row.nopayAmount
                  )
                ]);
              }
            }
          },
          {
            title: "操作",
            key: "action",
            width: 100,
            align: "center",
            fixed: "left",
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
                )
              ]);

            }
          },
          {
            title: "配件编码",
            key: "product.productCode",
            width: 110,
            fixed: "left",
            render: (h, params) => {
              return h("div", params.row.product.productCode);
            }
          },
          {
            title: "配件名称",
            key: "product.productName",
            fixed: "left",
            width: 110,
            render: (h, params) => {
              return h("div", params.row.product.productName);
            }

          },
          {
            title: "规格",
            key: "product.productSpec",
            width: 110,
            render: (h, params) => {
              return h("div", params.row.product.productSpec);
            }
          },
          {
            title: "销售员",
            width: 110,
            key:"salePerson.userName",
            render: (h, params) => {
              return h("div", params.row.salePerson.userName);
            }
          },
          {
            title: "客户",
            key: "customer.name",
            width: 110,
            render: (h, params) => {
              return h("div", params.row.customer.name);
            }
          },
          {
            title: "出库单价",
            key: "price",
            width: 110,
            sortable: true
          },
          {
            title: "出库数量",
            key: "num",
            width: 110,
            sortable: true
          },
          {
            title: "出库总价",
            key: "amount",
            width: 110,
            sortable: true
          },
          {
            title: "附加费",
            key: "surcharge",
            width: 110,
            sortable: true
          },
          {
            title: "总费用",
            key: "totalAmount",
            width: 110,
            sortable: true
          },

          {
            title: "出库时间",
            key: "createTime",
            width: 110,
            sortable: true
          },
          {
            title: "备注",
            key: "remark",
            width: 110,
            sortable: true
          }

        ],
        exportData: [],
        total: 0
      };
    },
    methods: {
      init() {
        this.getoutputList();
      },
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getoutputList();
      },
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getoutputList();
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      getoutputList() {
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/outputWarehouseDetail/getByCondition", this.searchForm).then(res => {
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
                filename: "出库记录"
              });
            }
          });
        } else if (name === "refresh") {
          this.getoutputList();
        }
      },
      selectRoles(v) {},
      cancelUpdate() {
        this.modalVisible = false;
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
      edit(v){
        this.$refs.outputWarehouseDetailFrom.resetFields();
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let outputWarehouseDetailInfo = JSON.parse(str);
        this.outputWarehouseDetailFrom = outputWarehouseDetailInfo;
        this.outputWarehouseDetailFrom.salePersonId = v.salePerson.id;
        this.outputWarehouseDetailFrom.productId = v.product.id;
        this.outputWarehouseDetailFrom.customerId = v.customer.id;
        this.modalTitle = "【"+v.product.productName+"】出库记录";
        this.modalVisible = true;
      },
      submitUpdateRecord() {
        this.$refs.outputWarehouseDetailFrom.validate(valid => {
          if (valid) {
            let url = "/outputWarehouseDetail/edit";
            this.submitLoading = true;
            this.postRequest(url, this.outputWarehouseDetailFrom).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.init();
                this.modalVisible = false;
              }
            });
          }
        });
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
            this.deleteRequest("/outputWarehouseDetail/delByIds", { ids: ids }).then(res => {
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
  @import "./outputRecord.less";
</style>
