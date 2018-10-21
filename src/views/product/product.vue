<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="配件名称" prop="productName">
                <Input type="text" v-model="searchForm.productName" clearable placeholder="请输入配件名称" style="width: 200px"/>
              </Form-item>
              <Form-item label="配件编码" prop="productCode">
                <Input type="text" v-model="searchForm.productCode" clearable placeholder="请输入配件编码" style="width: 200px"/>
              </Form-item>
              <span v-if="drop">
                              <Form-item label="规格" prop="productSpec">
                                <Input type="text" v-model="searchForm.productSpec" clearable placeholder="请输入配件规格" style="width: 200px"/>
                              </Form-item>
                              <Form-item label="配件类别" prop="sex">
                                <Select v-model="searchForm.productClass" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="0">女</Option>
                                  <Option value="1">男</Option>
                                </Select>
                              </Form-item>
                              <Form-item label="供应商" prop="type">
                                <Select v-model="searchForm.supplierId" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="0">AAA</Option>
                                  <Option value="1">BBB</Option>
                                </Select>
                              </Form-item>
                              <Form-item label="品牌" prop="brandId">
                                <Select v-model="searchForm.brandId" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="0">CCC</Option>
                                  <Option value="-1">DDD</Option>
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
          <Row class="operation margin-top-10 ">
            <Button @click="addProduct" type="primary" icon="plus-round">添加配件</Button>
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
    <!--新增配件弹框-->
    <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="600">
      <Form ref="productForm" :model="productForm" :label-width="90" :rules="productFormValidate">
        <FormItem label="配件名称" prop="productName">
          <Input v-model="productForm.productName"/>
        </FormItem>

        <FormItem label="配件代码" prop="productCode">
          <Input v-model="productForm.productCode"/>
        </FormItem>
        <FormItem label="配件规格" prop="productSpec">
          <Input v-model="productForm.productSpec"/>
        </FormItem>

        <FormItem label="配件类别" prop="productClass">
          <Select v-model="productForm.productClass"  @on-change="selectProductClass">
            <Option v-for="item in productClassList" :value="item.id" :key="item.id">{{ item.className }}</Option>
          </Select>
        </FormItem>

        <FormItem label="配件单位" prop="unit">
          <Select v-model="productForm.unit" >
            <Option v-for="item in unitList" :value="item.id" :key="item.id">{{ item.value }}</Option>
          </Select>
        </FormItem>

        <FormItem label="配件备注" prop="remark">
          <Input v-model="productForm.remark"/>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUser">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitProduct">提交</Button>
      </div>
    </Modal>
    <!--新增配件弹框-->
  </div>
</template>

<script>
  export default {
    name: "product",
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("密码长度不得小于6位"));
        } else {
          callback();
        }
      };
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
          productCode: "",
          productSpec: "",
          productClass: "",
          supplierId: "",
          brandId: "",
          pageNumber: 1,
          pageSize: 10,
          sort: "createTime",
          order: "desc",
          startDate: "",
          endDate: ""
        },
        modalType: 0,
        userModalVisible: false,
        modalTitle: "",
        productForm: {

        },
        userRoles: [],
        productClassList: [],
        unitList:[],
        errorPass: "",
        productFormValidate: {
          productName: [
            { required: true, message: "配件名称不能为空", trigger: "blur" }
          ],
          productCode: [
            { required: true, message: "配件代码不能为空", trigger: "blur" }
          ],
          productSpec: [
            { required: true, message: "配件规格不能为空", trigger: "blur" }
          ]
        },
        submitLoading: false,
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed: "left"

          },
          {
            title: "配件名称",
            key: "productName",
            width: 150,
            sortable: true,
            fixed: "left"

          },
          {
            title: "配件代码",
            key: "productCode",
            width: 110,
            sortable: true
          },
          {
            title: "规格",
            key: "productSpec",
            width: 150,
            sortable: true
          },
          {
            title: "类别",
            key: "productClass",
            width: 150,
            render: (h, params) => {
              return h("div", params.row.productClass.className);
            }
          },
          {
            title: "供应商",
            key: "supplierId",
            width: 150,
            sortable: true
          },
          {
            title: "品牌名",
            key: "brandId",
            width: 150,
            sortable: true
          },
          {
            title: "创建时间",
            key: "createTime",
            sortable: true,
            sortType: "desc",
            width: 150
          },
          {
            title: "操作",
            key: "action",
            width: 260,
            align: "center",
            fixed: "right",
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
                  ),
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
        this.getProductList();
        this.getUintList();
      },

      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getProductList();
      },
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getProductList();
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      getProductList() {
        debugger;
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/product/getByCondition", this.searchForm).then(res => {
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
      getProductClassList() {
        this.getRequest("/productClass/getAll").then(res => {
          if (res.success === true) {
            this.productClassList = res.result;
          }
        });
      },
      getUintList(){
        this.getRequest("/dictionary/getByType",{type:"unit"}).then(res => {
          if (res.success === true) {
            this.unitList = res.result;
          }
        });
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
                filename: "用户数据"
              });
            }
          });
        } else if (name === "refresh") {
          this.getProductList();
        }
      },
      selectProductClass(v) {},
      cancelUser() {
        this.userModalVisible = false;
      },
      submitProduct() {
        this.$refs.productForm.validate(valid => {
          if (valid) {
            let url = "/product/add";
            if (this.modalType === 1) {
              // 编辑用户
              url = "/product/edit";
            }else{
              delete this.productForm.id;
              url = "/product/add";
            }
            this.submitLoading = true;
            this.postRequest(url, this.productForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.init();
                this.userModalVisible = false;
              }
            });
          }
        });
      },
      addProduct() {
        this.modalType = 0;
        this.modalTitle = "添加配件";
        this.$refs.productForm.resetFields();
        this.userModalVisible = true;
      },
      //编辑
      edit(v) {
        debugger;
        this.modalType = 1;
        this.modalTitle = "编辑配件";
        this.$refs.productForm.resetFields();
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let productInfo = JSON.parse(str);
        this.productForm = productInfo;
        this.productForm.productClass = productInfo.productClass.id;
        // let selectRolesId = [];
        // this.productForm.roles.forEach(function(e) {
        //   selectRolesId.push(e.id);
        // });
        // this.productForm.roles = selectRolesId;
        this.userModalVisible = true;
      },
      //删除
      remove(v) {
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除用户 " + v.username + " ?",
          onOk: () => {
            this.deleteRequest("/product/delByIds", { ids: v.id }).then(res => {
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
            this.deleteRequest("/product/delByIds", { ids: ids }).then(res => {
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
      this.getProductClassList();
    }
  };
</script>

<style scoped>
@import "./product.less";
</style>
