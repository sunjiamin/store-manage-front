<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="配件编码" prop="productCode">
                <Input type="text" v-model="searchForm.productCode" clearable placeholder="请输入配件编码" style="width: 200px"/>
              </Form-item>

              <Form-item label="配件名" prop="productName">
                <Input type="text" v-model="searchForm.productName" clearable placeholder="请输入配件名" style="width: 200px"/>
              </Form-item>
              <span v-if="drop">
                <Form-item label="配件规格" prop="productSpec">
                <Input type="text" v-model="searchForm.productSpec" clearable placeholder="请输入配件规格" style="width: 200px"/>
                </Form-item>
                <Form-item label="库存开始" prop="stockStart">
                  <Input type="text"   v-model="searchForm.stockStart" clearable placeholder="请输入库存数量开始" style="width: 200px"/>
                </Form-item>
                <Form-item label="库存开始" prop="stockEnd">
                  <Input type="text" v-model="searchForm.stockEnd" clearable placeholder="请输入库存数量开始" style="width: 200px"/>
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
      <Form ref="thresholdFrom" :model="thresholdFrom" :label-width="80" :rules="thresholdFromValidate">
        <FormItem label="阀值" prop="stockThreshold">
          <Input v-model="thresholdFrom.stockThreshold"/>
        </FormItem>


      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelClass">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="setStockThreshold">提交</Button>
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
    name: "productStock",
    data() {
      const validateInt = (rule, value, callback) => {
        var reg = /^-?\d+$/;
        if (!reg.test(value)) {
          callback(new Error("请输入数字"));
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
          sort: "productStock",
          order: "asc",
          startDate: "",
          endDate: ""
        },
        modalType: 0,
        classModalVisible: false,
        modalTitle: "",
        thresholdFrom: {
          stockThreshold: "",
        },
        classRoles: [],
        roleList: [],
        errorPass: "",
        thresholdFromValidate: {
          stockThreshold: [
            { required: true, message: "阀值为整数", trigger: "blur" },
            { validator: validateInt, trigger: "blur" }
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
            title: "状态",
            key:"stockStatus",
            render: (h, params) => {
              return h("div", params.row.stockStatus);
            }
            // render: (h, params) => {
            //   let re = "";//1收款完成  2部分收款  3未收款  productStock  stockThreshold
            //   if (params.row.productStock <=  params.row.stockThreshold ) {
            //     return h("div", [
            //       h(
            //         "Tag",
            //         {
            //           props: {
            //             color: "red"
            //           }
            //         },
            //         "库存紧张"
            //       )
            //     ]);
            //   }else {
            //     return h("div", [
            //       h(
            //         "Tag",
            //         {
            //           props: {
            //             color: "green"
            //           }
            //         },
            //         "库存充足"
            //       )
            //     ]);
            //   }
            // }
          },
          {
            title: "配件编码",
            key: "productCode",
            render: (h, params) => {
              return h("div", params.row.productCode);
            }
          },
          {
            title: "配件名称",
            key: "productName",
            render: (h, params) => {
              return h("div", params.row.productName);
            }
          },
          {
            title: "规格",
            key: "productSpec",
            render: (h, params) => {
              return h("div", params.row.productSpec);
            }
          },
          {
            title: "库存",
            key: "productStock",
            sortable: true
          },
          {
            title: "阀值",
            key: "stockThreshold",
            sortable: true
          },
          {
            title: "最近更新时间",
            key: "updateTime",
            sortable: true,
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
                  "编辑阀值"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small",
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
        this.getProductStockList();
      },
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getProductStockList();
      },
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getProductStockList();
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      getProductStockList() {
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/productStock/getByCondition", this.searchForm).then(res => {
          this.loading = false;
          if (res.success === true) {
            if(res.result === null){
              this.data = [];
              this.total = 0;
            }else{
              this.data = res.result.content;
              this.total = res.result.totalElements;
            }
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
                filename: "配件库存."+util.getCurrentDatetime2()
              });
            }
          });
        } else if (name === "refresh") {
          this.getProductStockList();
        }
      },
      selectRoles(v) {},
      cancelClass() {
        this.classModalVisible = false;
      },
      setStockThreshold() {
        this.$refs.thresholdFrom.validate(valid => {
          if (valid) {
            let url = "/productStock/edit";

            this.submitLoading = true;
            this.postRequest(url, this.thresholdFrom).then(res => {
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

      edit(v) {
        this.modalType = 1;
        this.modalTitle = "设置阀值【"+v.product.productName+"】";
        this.$refs.thresholdFrom.resetFields();
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let classInfo = JSON.parse(str);
        this.thresholdFrom = classInfo;

        this.classModalVisible = true;
      } ,
      remove(v) {
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除库存 " + v.product.productName + " ?",
          onOk: () => {
            this.deleteRequest("/productStock/delByIds", { ids: v.id }).then(res => {
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
        debugger;

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
  @import "./productStock.less";
</style>
