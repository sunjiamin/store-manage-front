<style lang="less">
@import "./menuManage.less";
</style>
<template>
    <div class="search">
        <Card>
          <Row class="operation">
            <Button @click="addMenu" type="primary" icon="plus-round">添加子节点</Button>
            <Button @click="addRootMenu" type="ghost" icon="plus-round">添加一级菜单</Button>
            <Button @click="delAll" type="ghost" icon="trash-a">批量删除</Button>
            <Dropdown @on-click="handleDropdown">
              <Button type="ghost">
                更多操作
                <Icon type="arrow-down-b"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="refresh">刷新</DropdownItem>
                <DropdownItem name="expandTwo">仅展开两级</DropdownItem>
                <DropdownItem name="expandAll">展开所有</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Row>
          <Row type="flex" justify="start" class="code-row-bg">
            <Col span="6">
              <Tree :data="data" show-checkbox @on-check-change="changeSelect" @on-select-change="selectTree"></Tree>
              <Spin size="large" fix v-if="loading"></Spin>
            </Col>
            <Col span="9">
              <Form ref="menuForm" :model="menuForm" :label-width="85" :rules="menuFormValidate">
                <FormItem label="类型" prop="type">
                  <RadioGroup v-model="menuForm.type">
                    <Radio :label="0">
                      <Icon type="ios-list-outline"></Icon>
                      <span>页面菜单</span>
                    </Radio>
                    <Radio :label="1" :disabled="isMenu">
                      <Icon type="log-in"></Icon>
                      <span>操作按钮</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                 <FormItem label="名称" prop="title">
                  <Input v-model="menuForm.title"/>
                </FormItem>
                <FormItem label="路径" prop="path">
                  <Input v-model="menuForm.path"/>
                </FormItem>
                <FormItem label="按钮权限类型" prop="buttonType" v-if="menuForm.type===1">
                  <Select v-model="menuForm.buttonType" placeholder="请选择">
                    <Option value="add">添加操作</Option>
                    <Option value="edit">编辑操作</Option>
                    <Option value="delete">删除操作</Option>
                    <Option value="clearAll">清空全部</Option>
                    <Option value="enable">启用操作</Option>
                    <Option value="disable">禁用操作</Option>
                    <Option value="search">搜索操作</Option>
                    <Option value="output">导出操作</Option>
                    <Option value="editPerm">分配权限</Option>
                    <Option value="setDefault">设为默认</Option>
                  </Select>
                </FormItem>
                <div v-if="menuForm.type===0">
                  <FormItem label="英文名" prop="name">
                    <Input v-model="menuForm.name"/>
                  </FormItem>
                  <FormItem label="图标" prop="icon" style="margin-bottom: 5px;">
                    <Input v-model="menuForm.icon"/>
                    <span>
                      图标请参考 <a target="_blank" href="http://ionicons.com/"><Icon type="ionic"></Icon> ionicons</a>
                    </span>
                  </FormItem>
                  <FormItem label="前端组件" prop="component">
                    <Input v-model="menuForm.component"/>
                  </FormItem>
                </div>
                <FormItem label="排序值" prop="sortOrder">
                  <InputNumber :max="1000" :min="0" v-model="menuForm.sortOrder"></InputNumber>
                  <span style="margin-left:5px">值越小越靠前，支持小数</span>
                </FormItem>
                <FormItem label="是否启用" prop="status">
                  <i-switch size="large" v-model="editStatus" @on-change="changeEditSwitch">
                    <span slot="open">启用</span>
                    <span slot="close">禁用</span>
                  </i-switch>
                </FormItem>
                <Form-item>
                  <Button @click="submitEdit" :loading="submitLoading" type="primary" icon="compose">修改</Button>
                  <Button @click="handleReset" type="ghost" >重置</Button>
                </Form-item>
              </Form>
            </Col>
          </Row>
        </Card>

        <Modal :title="modalTitle" v-model="menuModalVisible" :mask-closable='false' :width="500">
          <Form ref="menuFormAdd" :model="menuFormAdd" :label-width="85" :rules="menuFormValidate">
            <div v-if="showParent">
              <FormItem label="上级节点：">
                {{menuForm.title}}
              </FormItem>
            </div>
            <FormItem label="类型" prop="type">
              <RadioGroup v-model="menuFormAdd.type">
                <Radio :label="0" :disabled="isButtonAdd">
                  <Icon type="ios-list-outline"></Icon>
                  <span>页面菜单</span>
                </Radio>
                <Radio :label="1" :disabled="isMenuAdd">
                  <Icon type="log-in"></Icon>
                  <span>操作按钮</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="名称" prop="title">
              <Input v-model="menuFormAdd.title"/>
            </FormItem>
            <FormItem label="路径" prop="path">
              <Input v-model="menuFormAdd.path"/>
            </FormItem>
            <FormItem label="按钮权限类型" prop="buttonType" v-if="menuFormAdd.type===1">
              <Select v-model="menuFormAdd.buttonType" placeholder="请选择">
                <Option value="add">添加操作</Option>
                <Option value="edit">编辑操作</Option>
                <Option value="delete">删除操作</Option>
                <Option value="clearAll">清空全部</Option>
                <Option value="enable">启用操作</Option>
                <Option value="disable">禁用操作</Option>
                <Option value="search">搜索操作</Option>
                <Option value="output">导出操作</Option>
                <Option value="editPerm">分配权限</Option>
                <Option value="setDefault">设为默认</Option>
              </Select>
            </FormItem>
            <div v-if="menuFormAdd.type===0">
              <FormItem label="英文名" prop="name">
                <Input v-model="menuFormAdd.name"/>
              </FormItem>
              <FormItem label="图标" prop="icon"  style="margin-bottom: 5px;">
                <Input v-model="menuFormAdd.icon"/>
                <span>
                  图标请参考 <a target="_blank" href="http://ionicons.com/"><Icon type="ionic"></Icon> ionicons</a>
                </span>
              </FormItem>
              <FormItem label="前端组件" prop="component">
                <Input v-model="menuFormAdd.component"/>
              </FormItem>
            </div>
            <FormItem label="排序值" prop="sortOrder">
              <InputNumber :max="1000" :min="0" v-model="menuFormAdd.sortOrder"></InputNumber>
              <span style="margin-left:5px">值越小越靠前，支持小数</span>
            </FormItem>
            <FormItem label="是否启用" prop="status">
              <i-switch size="large" v-model="addStatus" @on-change="changeAddSwitch">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" @click="cancelAdd">取消</Button>
            <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
          </div>
        </Modal>
    </div>
</template>


//js 和 vue界面分离
<script>
  import menuManage from './menuManage'


  export default {
    ...menuManage
  }
</script>
