<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="分组类型" prop="groupType">
                <Select v-model="searchForm.groupType" placeholder="请选择" clearable style="width: 200px">
                  <Option value="2" >按月</Option>
                  <Option value="1">按天</Option>
                  <Option value="3">按年</Option>
                </Select>
              </Form-item>
              <Form-item label="统计时间" prop="status">
                <DatePicker type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
              </Form-item>

              <Form-item style="margin-left:-35px;">
                <Button @click="handleSearch" type="primary" icon="search">搜索</Button>
                <Button @click="handleReset" type="ghost" >重置</Button>
              </Form-item>
            </Form>
          </Row>

          <Row>
            <Form   inline :label-width="100" class="search-form">
              <Form-item label="进货总和" prop="costTotal">
                <h1  >{{this.data.costTotal}}¥</h1>
              </Form-item>
              <Form-item label="出货总和" prop="costTotal">
                <h1>{{this.data.outputTotal}}¥</h1>
              </Form-item>

              <Form-item label="利润总和" prop="costTotal">
                <h1>{{this.data.profitTotal}}¥</h1>
              </Form-item>
              <Form-item label="未收款总和" prop="costTotal">
                <h1>{{this.data.noPayTotal}}¥</h1>
              </Form-item>
            </Form>



          </Row>

          <Row class="operation margin-top-10 ">
            <div  style="width:100%;height:600px"  id="census_profit"></div>
          </Row>

        </Card>
      </Col>
    </Row>

  </div>
</template>

<script>
  import echarts from 'echarts';
  export default {
    name: "profitCensus",
    data() {


      return {
        loading: true,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "chevron-down",

        searchForm: {
          startDate: "2018-01-01",
          endDate: "2018-10-18",
          groupType:"2"
        },

        submitLoading: false,
        data: [],
        total: 0,
        chart_profit: null,
        //进货总和
        costTotal: null,
        //出货金额
        outputTotal:null,
        //利润总和
        profitTotal:null,
        //未收款总和
        noPayTotal:null,

      };
    },
    methods: {
      init() {
        this.initChart();
        this.getConsus();
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      getConsus(){
        this.loading = true;
        this.getRequest("/census/getProfit", this.searchForm).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.data = res.result;

            // this.data.costTotal
            //
            // this.outputTotal
            //
            // this.profitTotal
            //
            // this.noPayTotal
            this.initChart();
          }
        });
      },
      handleSearch() {
        this.init();
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        // 重新加载数据
        this.init();
      },
      initChart(){
        this.chart_profit = echarts.init(document.getElementById('census_profit'));
        const  option = {
          title : {
            text: '收益统计',
              subtext: ' '
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['入库总和','出库总和','利润','未支付']
          },
          toolbox: {
            show : true,
              feature : {
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          calculable : true,
            xAxis : [
            {
              type : 'category',
              data :   this.data.titileList
            }
          ],
            yAxis : [
            {
              type : 'value'
            }
          ],
            series : [
            {
              name:'入库总和',
              type:'bar',
              data: this.data.costList,
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }
            },
            {
              name:'出库总和',
              type:'bar',
              data:  this.data.outPutList,
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }
            },
            {
              name:'利润',
              type:'bar',
              data: this.data.profitList,
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }
            },
            {
              name:'未支付',
              type:'bar',
              data: this.data.noPayList,
              markPoint : {
                data : [
                  {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
                  {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name : '平均值'}
                ]
              }
            }
          ]
        }

        this.chart_profit.setOption(option);

        window.addEventListener('resize', function () {
          if (!this.chart){
            this.chart_profit.resize();
          }
        });
      }

    },
    mounted() {
      this.init();

    },
    beforeDestroy() {
      if (!this.chart) { return }
      this.chart_profit.dispose();
      this.chart_profit = null;
    },

  };
</script>

<style scoped>
  @import "./profitCensus.less";
</style>
