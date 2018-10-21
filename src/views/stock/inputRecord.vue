<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="配件名" prop="productName">
                <Input type="text" v-model="searchForm.productName" clearable placeholder="请输入配件名" style="width: 200px"/>
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
            <Page :current="this.searchForm.pageNumber" :total="total" :page-size="this.searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[2,10,20,50,100,9999999]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>

  </div>
</template>

<script>
  export default {
    name: "inputWarehouseDetail",
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
        classModalVisible: false,
        modalTitle: "",
        inputWarehouseDetailFrom: {

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
            title: "配件编码",
            key: "productCode",
            width: 110,
            render: (h, params) => {
              return h("div", params.row.product.productCode);
            }
          },
          {
            title: "配件名称",
            key: "product",
            width: 110,
            render: (h, params) => {
              return h("div", params.row.product.productName);
            }

          },
          {
            title: "规格",
            key: "productSpec",
            width: 110,
            render: (h, params) => {
              return h("div", params.row.product.productSpec);
            }
          },
          {
            title: "入库单位",
            key: "unit",
            sortable: true
          },
          {
            title: "入库单价",
            key: "price",
            sortable: true
          },
          {
            title: "入库数量",
            key: "num",
            sortable: true
          },
          {
            title: "入库总价",
            key: "amount",
            sortable: true
          },
          {
            title: "入库时间",
            key: "createTime",
            width: 110,
            sortable: true
          },
          {
            title: "备注",
            key: "remark",
            sortable: true
          }

        ],
        exportData: [],
        total: 0
      };
    },
    methods: {
      init() {
        this.getInputList();
      },
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getInputList();
      },
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getInputList();
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      getInputList() {
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/inputWarehouseDetail/getByCondition", this.searchForm).then(res => {
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
                filename: "入库记录"
              });
            }
          });
        } else if (name === "refresh") {
          this.getInputList();
        }
      },
      selectRoles(v) {},
      cancelClass() {
        this.classModalVisible = false;
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
            this.deleteRequest("/inputWarehouseDetail/delByIds", { ids: ids }).then(res => {
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
  @import "./inputRecord.less";
</style>
