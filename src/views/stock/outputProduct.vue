<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row class="operation  ">
            <Button @click="selectSalePerson" type="warning"  >选择出货员</Button>
            <span>当前销售员:【{{this.currentSalePerson.userName}}】</span>

          </Row>
          <Row class="operation margin-top-10">
            <Button @click="addInputProduct" type="primary" icon="plus-round">添加配件出库</Button>
            <Button @click="delAll" type="ghost" icon="trash-a">批量删除</Button>

          </Row>
          <Row class="margin-top-10 ">
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
            <Button @click="submitProductOutput" type="success" :loading="enableOutput"  size="large" icon="jet">出库</Button>
          </Row>

        </Card>
      </Col>
    </Row>
    <!--弹出库存选择-->
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
        <Table :loading="loading" border :columns="columnsProductStock" :data="DateProductStock" sortable="custom" @on-sort-change="changeSort"
               @on-selection-change="showSelect" ref="table1"></Table>
      </Row>
      <Row type="flex" justify="end" class="code-row-bg page">
        <Page :current="this.searchForm.pageNumber" :total="totalProduct" :page-size="this.searchForm.pageSize" @on-change="changePage"
              @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
      </Row>

    </Modal>
    <!--弹出库存选择-->

    <Modal :title="modalTitleProductNum" v-model="productNumModalVisible" :mask-closable='false' :width="700">
      <Form ref="productNumForm" :model="productNumForm" :label-width="100"   :rules="productNumFormValidate">

        <FormItem label="当前库存" prop="curNum">
          <span  >{{productNumForm.curNum}}</span>
        </FormItem>
        <FormItem label="参考出库单价" prop="curPrice">
          <span  >{{productNumForm.curPrice}}</span>
        </FormItem>
        <FormItem label="出库单价" prop="price">
          <Input v-model="productNumForm.price"/>
        </FormItem>
        <FormItem label="出库数量" prop="num" >
          <Input   v-model="productNumForm.num"/>
        </FormItem>

        <FormItem label="购买客户" prop="customerId">
          <Select v-model="productNumForm.customerId"  @on-change="selectProductClass">
            <Option v-for="item in customerList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="收款状态" prop="payStatus">
          <RadioGroup v-model="productNumForm.payStatus">
            <Radio :label="1">收款完成</Radio>
            <Radio :label="2">部分收款</Radio>
            <Radio :label="3">未收款</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="附加费" prop="surcharge" >
          <Input   v-model="productNumForm.surcharge"/>
        </FormItem>

        <FormItem label="总未到账金额" prop="nopayAmount" >
          <Input   v-model="productNumForm.nopayAmount"/>
        </FormItem>

        <FormItem label="出库备注" prop="remark">
          <Input v-model="productNumForm.remark"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitProduct">确认</Button>
      </div>
    </Modal>


    <!--销售员弹出库存选择-->
    <Modal :title="salePersonModalTitle" v-model="salePersonModalVisible" :mask-closable='false' :width="1000">
      <Row>
        <Form ref="salePersonSearchForm" :model="salePersonSearchForm" inline :label-width="70" class="search-form">
          <Form-item label="姓名" prop="className">
            <Input type="text" v-model="salePersonSearchForm.userName" clearable placeholder="请输入姓名" style="width: 200px"/>
          </Form-item>
          <Form-item label="手机号" prop="classCode">
            <Input type="text" v-model="salePersonSearchForm.mobile" clearable placeholder="请输入手机号" style="width: 200px"/>
          </Form-item>
          <span v-if="drop">
                    <Form-item label="性别" prop="sex">
                      <Select v-model="salePersonSearchForm.sex" placeholder="请选择" clearable style="width: 200px">
                        <Option value="0">女</Option>
                        <Option value="1">男</Option>
                      </Select>
                    </Form-item>
                    <Form-item label="创建时间" prop="status">
                      <DatePicker type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRangeSalePerson" placeholder="选择起始时间" style="width: 200px"></DatePicker>
                    </Form-item>
              </span>
          <Form-item style="margin-left:-35px;">
            <Button @click="handleSaleSearch" type="primary" icon="search">搜索</Button>
            <Button @click="handleSaleReset" type="ghost" >重置</Button>
            <a class="drop-down" @click="dropDown">{{dropDownContent}}
              <Icon :type="dropDownIcon"></Icon>
            </a>
          </Form-item>
        </Form>
      </Row>

      <Row class="margin-top-10 searchable-table-con1">
        <Table :loading="loading" border :columns="salePersonColumns" :data="DateSalePerson" sortable="custom" @on-sort-change="changeSortSalePerson"
               @on-selection-change="showSelect" ref="table2"></Table>
      </Row>
      <Row type="flex" justify="end" class="code-row-bg page">
        <Page :current="this.salePersonSearchForm.pageNumber" :total="totalSalePerson" :page-size="this.salePersonSearchForm.pageSize" @on-change="changePageSalePerson"
              @on-page-size-change="changePageSizeSalePerson" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
      </Row>

    </Modal>
    <!--销售员弹出库存选择-->

  </div>
</template>

<script>
  export default {
    name: "product-output",

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
        salePersonSearchForm: {
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
        productNumModalVisible:false,
        salePersonModalVisible:false,
        modalTitle: "",
        modalTitleProductNum:"",
        salePersonModalTitle:"",
        classFrom: {

        },
        productNumForm: {
          curNum:"",
          curPrice:"",//当前卖价
          costPrice:"",//当前进价
          num:"",
          unit:"",
          price:"",
          amount:"",
          customerId:"",
          payStatus:"",
          nopayAmount:"",
          nopayAmount:"",
          surcharge:"",
          remark:""
        },
        //选择的商品列表
        productList:[],
        customerList:[],
        errorPass: "",
        productNumFormValidate: {
          price: [
            { required: true, message: "金额不能为空", trigger: "blur" },
            { validator: validateFloat, trigger: "blur" }
          ],
          num: [
            { required: true, message: "数量不能为空", trigger: "blur" },
            { validator: validateInt, trigger: "blur" }
          ],
          nopayAmount:[
            { required: true, message: "未到款不能为空,没有请输入0", trigger: "blur" },
            { validator: validateFloat, trigger: "blur" }
          ],
          surcharge:[
            { required: true, message: "附加费，没有请输入0", trigger: "blur" },
            { validator: validateFloat, trigger: "blur" }
          ]
          // status: [
          //   { required: true, message: "状态不能为空", trigger: "blur" },
          // ],
          // customer: [
          //   { required: true, message: "客户不能为空", trigger: "blur" },
          // ]
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
            width: 110,
            sortable: true
          },
          {
            title: "销售员",
            key: "salePersonName",
            width: 110,
            sortable: true
          },
          {
            title: "客户",
            key: "customer",
            width: 110,
            render: (h, params) => {
              return h("div", params.row.customer.name);
            }
          },

          {
            title: "当前卖价",
            key: "curPrice",
            width: 110,
            sortable: true
          },
          {
            title: "出货价",
            key: "price",
            width: 110,
            sortable: true
          },
          {
            title: "数量",
            key: "num",
            width: 110,
            sortable: true
          },
          {
            title: "总价",
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
          }, {
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
              }else{
                return h("div",params.row.payStatus )
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
            title:"备注",
            key:"remark",
            width: 150,
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
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
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
        //商品库存弹出框表格
        columnsProductStock: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed:"left",
          },
          {
            title: "配件名",
            key: "productName",
            // render: (h, params) => {
            //   return h("div", params.row.product.productName);
            // }
          },
          {
            title: "配件代码",
            key: "productCode",
            // render: (h, params) => {
            //   return h("div", params.row.product.productCode);
            // }
          },
          {
            title: "规格",
            key: "productSpec",
            // render: (h, params) => {
            //   return h("div", params.row.product.productSpec);
            // }
          },
          {
            title: "库存",
            key: "productStock",
            sortable: true
          },
          {
            title: "最近更新时间",
            key: "updateTime",
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
                        this.selectProductStock(params.row);
                      }
                    }
                  },
                  "选择"
                )
              ]);
            }
          }
        ],
        //销售员选择框
        salePersonColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            fixed:"left",
          },
          {
            title: "用户名",
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
            width: 110,
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
                        this.selectSalePersonOk(params.row);
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
        DateProductStock:[],
        DateSalePerson:[],
        exportData: [],
        //当前销售员
        currentSalePerson:{},
        totalProduct: 0,
        totalSalePerson:0,
        enableOutput:false
      };
    },
    methods: {
      init() {
        this.productList=[];
        this.getCustomerList();
      },
      getCustomerList() {
        this.getRequest("/customer/getAll").then(res => {
          if (res.success === true) {
            this.customerList = res.result;
          }
        });
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

      changePageSalePerson(v) {
        this.salePersonSearchForm.pageNumber = v;
        this.getSaleList();
      },
      changePageSizeSalePerson(v) {
        this.salePersonSearchForm.pageSize = v;
        this.getSaleList();
      },
      selectDateRangeSalePerson(v) {
        if (v) {
          this.salePersonSearchForm.startDate = v[0];
          this.salePersonSearchForm.endDate = v[1];
        }
      },
      changeSortSalePerson(e) {
        this.salePersonSearchForm.sort = e.key;
        this.salePersonSearchForm.order = e.order;
        if (e.order === "normal") {
          this.salePersonSearchForm.order = "";
        }
        this.getSaleList();
      },
      handleSaleSearch() {
        this.salePersonSearchForm.pageNumber = 1;
        this.salePersonSearchForm.pageSize = 10;
        this.getSaleList();
      },
      handleSaleReset() {
        this.$refs.searchForm.resetFields();
        this.salePersonSearchForm.pageNumber = 1;
        this.salePersonSearchForm.pageSize = 10;
        // 重新加载数据
        this.getSaleList();
      },

      getSaleList() {
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/salePerson/getByCondition", this.salePersonSearchForm).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.DateSalePerson = res.result.content;
            this.totalSalePerson = res.result.totalElements;
          }
        });
      },

      getProductList() {
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/productStock/getByCondition", this.searchForm).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.DateProductStock = res.result.content;
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
                filename: "出库记录"
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
      //选择销售员
      selectSalePerson(){
        this.salePersonModalTitle = "选择销售员";
        this.salePersonModalVisible = true;
        this.getSaleList();

      },
      selectSalePersonOk(v){
        this.currentSalePerson = v;
        this.salePersonModalVisible = false;
        this.productList=[];
      },

      //弹出选择出库商品框
      addInputProduct() {
        if(null==this.currentSalePerson.userName){
          this.$Message.warning("请先选择销售员！！！");
        }else {
          this.modalType = 0;
          this.modalTitle = "添加配件出库";
          this.classModalVisible = true;
          this.getProductList();
        }
      },
      //选择完出库商品
      selectProductStock(v) {
        let id = v.product.id;
        let exits = false;
        for (var i = 0;i<this.productList.length;i++){
          let e = this.productList[i];
          if(e.productId===id){
            exits = true;
            break;
          }
        }
        if(exits){
          this.$Message.warning("【"+ this.productNumForm.productName+"】已添加，请选择其他");
        }else{
         // this.classModalVisible = false;
          this.$refs.productNumForm.resetFields();
          this.productNumForm.productId=v.product.id;
          this.productNumForm.productName=v.product.productName;
          this.productNumForm.productCode=v.product.productCode;
          this.productNumForm.productSpec=v.product.productSpec;
          this.productNumForm.productStock= v;
          this.productNumForm.curNum= v.productStock;
          this.productNumForm.curPrice = v.product.productSalePrice;
          this.productNumForm.costPrice = v.product.productPrice;
          this.modalTitleProductNum= "【"+this.productNumForm.productName+"】 出库";
          this.productNumModalVisible=true;
        }
      } ,
      cancel(){
        this.productNumModalVisible=false;
      },
      //输入完商品数量，待提交
      submitProduct(){
        this.$refs.productNumForm.validate(valid => {
          if (valid) {

            if( this.productNumForm.price <  this.productNumForm.costPrice){
              this.$Modal.confirm({
                title: "确认删除",
                content: "您确认要配件出库价要比进价低吗?",
                onOk: () => {
                  this.submitValided();
                }
              });
            }else{
              this.submitValided();
            }
          }
        });

      },
      submitValided(){
        let outputProduct={};
        let isOk = true;
        outputProduct.payStatus = this.productNumForm.payStatus;
        outputProduct.nopayAmount = this.productNumForm.nopayAmount;
        if(outputProduct.payStatus === 1){
          isOk = outputProduct.nopayAmount === 0;
        }else{
          isOk = outputProduct.nopayAmount > 0;
        }
        if(outputProduct.nopayAmount > 0){
          isOk = outputProduct.payStatus !==1;
        }else{
          isOk = outputProduct.payStatus ===1;
        }
        if(!isOk){
          this.$Message.warning("收款状态和未到账金额不符合！！");
        }else{

          outputProduct.productId= this.productNumForm.productId;
          outputProduct.productName= this.productNumForm.productName;
          outputProduct.productCode= this.productNumForm.productCode;
          outputProduct.productSpec= this.productNumForm.productSpec;
          outputProduct.amount= parseFloat(this.productNumForm.price) * parseFloat(this.productNumForm.num);
          outputProduct.surcharge = this.productNumForm.surcharge;
          if(outputProduct.surcharge === ''){
            outputProduct.surcharge = 0;
          }
          outputProduct.totalAmount = outputProduct.amount +  parseFloat(outputProduct.surcharge );
          outputProduct.price= this.productNumForm.price;
          outputProduct.curPrice= this.productNumForm.curPrice;
          outputProduct.costPrice= this.productNumForm.costPrice;
          outputProduct.num = this.productNumForm.num;
          outputProduct.unit = this.productNumForm.unit;

          outputProduct.remark = this.productNumForm.remark;


          outputProduct.productStock=  this.productNumForm.productStock;
          delete outputProduct.productStock.createTime;
          delete outputProduct.productStock.updateTime;
          delete outputProduct.productStock.product.createTime;
          delete outputProduct.productStock.product.updateTime;
          outputProduct.salePersonId = this.currentSalePerson.id;
          outputProduct.salePersonName =  this.currentSalePerson.userName;

          for (var i = 0;i<this.customerList.length;i++){
            let e = this.customerList[i];
            if(e.id ===  this.productNumForm.customerId){
              outputProduct.customer =e;
              outputProduct.customerId=e.id;
              break;
            }
          }
          delete outputProduct.customer.createTime;
          delete outputProduct.customer.updateTime;
          //选择一种商品入库
          this.productList.push(outputProduct);
          this.$refs.productNumForm.resetFields();
          this.productNumModalVisible=false;
          this.classModalVisible = false;

        }
      },
      //提交后台出库
      submitProductOutput() {
        if(this.productList.length>0){
          let url = "/outputWarehouse/add";
          this.submitLoading = true;
          this.enableOutput = true;
          let paraData = {};
          paraData.outputWarehouseDetailList=JSON.stringify(this.productList);
          this.postRequest(url,paraData).then(res => {
            this.submitLoading = false;
            this.enableOutput = false;
            if (res.success === true) {
              this.$Message.success("出库成功");
              this.init();
            }
          });
        }else{
          this.$Message.warning("还没有选择配件");
        }

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
      removeById(id) {
        let index ;
        for (var i = 0;i<this.productList.length;i++){
          let e = this.productList[i];
          if(e.productId===id){
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
            this.selectList.forEach(function(ee) {
              this.removeById(ee);
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
