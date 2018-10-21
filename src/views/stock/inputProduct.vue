<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row class="operation">
            <Button @click="addInputProduct" type="primary" icon="plus-round">添加配件入库</Button>
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
          <Row class="margin-top-10" >
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row class="margin-top-10 searchable-table-con1">
            <Table   border :columns="columns" :data="productList" sortable="custom" @on-sort-change="changeSort"
                   @on-selection-change="showSelect" ref="table"></Table>
          </Row>

          <Row class="operation margin-top-10">
            <Button @click="submitProductInput" type="success" size="large" icon="jet">入库</Button>
          </Row>

        </Card>
      </Col>
    </Row>
    <Modal :title="modalTitle" v-model="classModalVisible" :mask-closable='false' :width="1000">
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="配件名称" prop="productName">
            <Input type="text" v-model="searchForm.productName" clearable placeholder="请输入配件名称" style="width: 200px"/>
          </Form-item>
          <Form-item label="配件编码" prop="productCode">
            <Input type="text" v-model="searchForm.productCode" clearable placeholder="请输入配件编码" style="width: 200px"/>
          </Form-item>

          <Form-item style="margin-left:-35px;">
            <Button @click="handleSearch" type="primary" icon="search">搜索</Button>
            <Button @click="handleReset" type="ghost" >重置</Button>
          </Form-item>
        </Form>
      </Row>

      <Row class="margin-top-10 searchable-table-con1">
        <Table :loading="loading" border :columns="columnsProduct" :data="DateProduct" sortable="custom" @on-sort-change="changeSort"
               @on-selection-change="showSelect" ref="table"></Table>
      </Row>
      <Row type="flex" justify="end" class="code-row-bg page">
        <Page :current="this.searchForm.pageNumber" :total="totalProduct" :page-size="this.searchForm.pageSize" @on-change="changePage"
              @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
      </Row>

    </Modal>

    <Modal :title="modalTitleProductNum" v-model="productNumModalVisible" :mask-closable='false' :width="500">
      <Form ref="productNumForm" :model="productNumForm" :label-width="70"   :rules="productNumFormValidate">
        <FormItem label="单位" prop="unit">
          <Select v-model="productNumForm.unit" placeholder="请选择">
            <Option :value="0">件</Option>
            <Option :value="1">个</Option>
            <Option :value="2">壶</Option>
            <Option :value="3">对</Option>
            <Option :value="4">套</Option>
            <Option :value="5">包</Option>
            <Option :value="6">粒</Option>
            <Option :value="7">条</Option>
            <Option :value="8">片</Option>
            <Option :value="9">桶</Option>
          </Select>
        </FormItem>
        <FormItem label="单价" prop="price">
          <Input v-model="productNumForm.price"/>
        </FormItem>
        <FormItem label="数量" prop="num" >
          <Input   v-model="productNumForm.num"/>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <Input v-model="productNumForm.remark"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="submitLoading" @click="submitProduct">确认</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  export default {
    name: "product-input",

    data() {
      const validateFloat = (rule, value, callback) => {
          var reg = /^-?\d*\.?\d+$/;
          if (!reg.test(value)) {
            callback(new Error("请输入数字"));
          } else {
            callback();
          }
        };
      const validateInt = (rule, value, callback) => {
        var reg = /^-?\d+$/;
        if (!reg.test(value)) {
          callback(new Error("请输入数字"));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "chevron-down",
        selectCount: 0,
        selectList: [],
        searchForm: {
          productName: "",
          productCode: "",
          pageNumber: 1,
          pageSize: 10,
          sort: "createTime",
          order: "desc",
          startDate: "",
          endDate: ""
        },
        modalType: 0,
        classModalVisible: false,
        productNumModalVisible:false,
        modalTitle: "",
        modalTitleProductNum:"",
        classFrom: {

        },
        productNumForm: {
          num:"",
          unit:"",
          price:"",
          amount:""
        },
        //选择的商品列表
        productList:[],
        errorPass: "",
        productNumFormValidate: {
          price: [
            { required: true, message: "单价不能为空", trigger: "blur" },
            { validator: validateFloat, trigger: "blur" }
          ],
          num: [
            { required: true, message: "数量不能为空", trigger: "blur" },
            { validator: validateInt, trigger: "blur" }
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
            title: "单位",
            key: "unit",
            width: 150,
            sortable: true
          },
          {
            title: "单价",
            key: "price",
            width: 150,
            sortable: true
          },
          {
            title: "数量",
            key: "num",
            width: 150,
            sortable: true
          },
          {
            title: "总价",
            key: "amount",
            width: 150,
            sortable: true
          },
          {
            title: "操作",
            key: "action",
            width: 200,
            fixed: "right",
            align: "center",
            render: (h, params) => {
              return h("div", [
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
        //商品弹出框表格
        columnsProduct: [
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
                        this.selectProduct(params.row);
                      }
                    }
                  },
                  "选择"
                )
              ]);

            }
          }
        ],
        data: [],
        DateProduct:[],
        exportData: [],
        totalProduct: 0
      };
    },
    methods: {
      init() {
        this.productList=[];
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
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/product/getByCondition", this.searchForm).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.DateProduct = res.result.content;
            this.totalProduct = res.result.totalElements;
          }
        });
      },
      handleSearch() {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getProductList();
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        // 重新加载数据
        this.getProductList();
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
                filename: "用户数据"
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
      //提交后台入库
      submitProductInput() {
        if(this.productList.length>0){
          let url = "/inputWarehouse/add";
          this.submitLoading = true;
          let paraData = {};
          paraData.inputWarehouseDetailList=JSON.stringify(this.productList);
          this.postRequest(url,paraData).then(res => {
            this.submitLoading = false;
            if (res.success === true) {
              this.$Message.success("入库成功");
              this.init();
            }
          });
        }else{
          this.$Message.warning("还没有选择配件");
        }

      },
      addInputProduct() {
        this.modalType = 0;
        this.modalTitle = "添加配件入库";
        this.classModalVisible = true;
        this.getProductList();
      },
      selectProduct(v) {
        let id = v.id;
        let exits = false;
        for (var i = 0;i<this.productList.length;i++){
          let e = this.productList[i];
          if(e.id===id){
            exits = true;
            break;
          }
        }
        if(exits){
          this.$Message.warning("【"+ this.productNumForm.productName+"】已添加，请选择其他");
        }else{
          this.classModalVisible = false;
          this.$refs.productNumForm.resetFields();
          this.productNumForm.productId=v.id;
          this.productNumForm.productName=v.productName;
          this.productNumForm.productCode=v.productCode;
          this.productNumForm.productSpec=v.productSpec;
          this.productNumForm.product= v;
          this.modalTitleProductNum= "【"+this.productNumForm.productName+"】 入库";
          this.productNumModalVisible=true;
        }
      } ,
      //输入完商品数量，待提交
      submitProduct(){
        this.$refs.productNumForm.validate(valid => {
          if (valid) {
            let product={};
            product.productId= this.productNumForm.productId;
            product.productName= this.productNumForm.productName;
            product.productCode= this.productNumForm.productCode;
            product.productSpec= this.productNumForm.productSpec;
            product.amount= parseFloat(this.productNumForm.price) * parseFloat(this.productNumForm.num);
            product.price= this.productNumForm.price;
            product.num = this.productNumForm.num;
            product.unit = this.productNumForm.unit;
            product.product=  this.productNumForm.product;
            delete product.product.createTime;
            delete product.product.updateTime;
            delete product.product.productClass;
            //选择一种商品入库
            this.productList.push(product);
            this.$refs.productNumForm.resetFields();
            this.productNumModalVisible=false;
          }
        });

      },
      remove(v) {
        let index ;
        for (var i = 0;i<this.productList.length;i++){
          let e = this.productList[i];
          if(e.productId===v.productId){
            index=i;
            break;
          }
        }

        if(index > -1){
          this.productList.splice(index,1);
        }

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
  @import "./inputProduct.less";
</style>
