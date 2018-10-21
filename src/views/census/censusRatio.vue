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


            </Form>

          </Row>

          <Row class="operation margin-top-10 ">
            <div  style="width:80%;height:500px"  id="census_profit"></div>
          </Row>

        </Card>
      </Col>
    </Row>

  </div>
</template>

<script>
  import echarts from 'echarts';
  export default {
    name: "censusRatio",
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
        legendData :[],
        seriesData :[]

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
        this.getRequest("/census/getRatio", this.searchForm).then(res => {
          this.loading = false;
          debugger;
          if (res.success === true) {
            this.data = res.result;
            this.legendData = res.result.titileList;
            let outValues = res.result.outPutList;
            let seriesData =[];
            outValues.forEach(function (e) {
               seriesData.push({
                name: e.key,
                value: e.value
              });
            });
            this.seriesData = seriesData;

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
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: this.legendData
          },
          series: [
            {
              name: '出货占比',
              type: 'pie',
              radius: '66%',
              center: ['50%', '50%'],
              data: this.seriesData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        this.chart_profit.setOption(option);

        window.addEventListener('resize', function () {
          if (!this.chart){
            //this.chart_profit.resize();
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
  @import "./censusRatio.less";
</style>
