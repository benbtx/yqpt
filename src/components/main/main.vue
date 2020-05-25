<style>
.menu-icon{
    transition: all .3s;
}
.rotate-icon{
    transform: rotate(-90deg);
}
.ivu-menu-vertical .ivu-menu-item.menu-li{
  padding: 10px 10px;
  margin-left: 20px;
}
.menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .5s ease .5s;
    transition: display .5s ease .5s;
}

.menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span{
    display: none;
}
.collapsed-menu .ivu-menu-item{

}
.collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 25px;
}
</style>
<template>
  <Layout style="height: 100%" class="main">
      <Header class="header-con">
          <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
            <user :message-unread-count="unreadCount" :user-avatar="userAvatar"/>
            <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
            <!-- <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store> -->
            <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
          </header-bar>

      </Header>
      <Layout>
        <!-- <Sider   v-model="isCollapsed" collapsed-width="55" width="160">
         // default-collapsed // collapsible
          <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses" @on-select="mainmenu_click">
              <MenuItem name="node-manage" class="menu-li">
                  <Icon type="ios-apps" />
                  <span>节点管理</span>
              </MenuItem>
              <MenuItem name="flow-manage" class="menu-li">
                  <Icon type="ios-paper" />
                  <span>模板管理</span>
              </MenuItem>
              <MenuItem name="ele-manage" class="menu-li">
                  <Icon type="md-settings" />
                  <span>组件管理</span>
              </MenuItem>
              <MenuItem name="ds-manage" class="menu-li">
                  <Icon type="ios-browsers"></Icon>
                  <span>数据源管理</span>
              </MenuItem>
              <MenuItem name="sys-manage" class="menu-li">
                  <Icon type="ios-build" />
                  <span>系统管理</span>
              </MenuItem>
          </Menu>
        </Sider> -->

        <Sider  collapsible  :width="180" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
          <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
            <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
            <!-- <div class="logo-con">
              <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
              <img v-show="collapsed" :src="minLogo" key="min-logo" />
            </div> -->
          </side-menu>
        </Sider>
              <!-- 导航栏 -->
           <!-- a/d/d -->
        <!-- <div style='display:inline-block'>
        </div>
         -->
        <Content style="background: #fff;">
          <Layout style="height: 100%;">
              <div style="background-color: #f8f8f9;">
              <custom-bread-crumb show-icon style="background-color: #f8f8f9;margin-left: 30px;margin-top:20px;margin-bottom:20px" :list="breadCrumbList"></custom-bread-crumb>

              </div>
               <Content style='    padding: 0px 18px 18px;'> <router-view/> </Content>
               <!-- <router-view/> -->
          </Layout>
        </Content>
      </Layout>

    <!--
    <Layout>
      <Header class="header-con">
        <Menu mode="horizontal" >
            <Submenu  name="a">
                <template slot="title">
                        <Icon type="ios-paper" />
                        工程
                </template>
                <MenuItem name="3-4">工程设置</MenuItem>
                <MenuItem name="3-5">保存</MenuItem>
            </Submenu >
            <MenuItem name="b">
                <Icon type="ios-people"></Icon>
                组件管理
            </MenuItem>
        </Menu>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <router-view/>
        </Layout>
      </Content>
    </Layout>
    -->
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import customBreadCrumb from './components/header-bar/custom-bread-crumb'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
    customBreadCrumb
  },
  data () {
    return {
      collapsed: false,
      isCollapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    breadCrumbList () {
      console.log(this.$store.state.app.breadCrumbList[0])
      return this.$store.state.app.breadCrumbList
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    },

    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }

  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    mainmenu_click: function (cmd) {
      console.log(cmd)
      if (cmd == 'node-manage') {
        // this.$router.push({"name":"node_manage"})
        this.turnToPage('node_manage')
      } else if (cmd == 'flow-manage') {
        this.turnToPage('flow_manage')
      } else if (cmd == 'ele-manage') {
        this.turnToPage('ele_manage')
      } else if (cmd == 'ds-manage') {
        this.turnToPage('ds_manage')
      }
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      // this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    // 获取未读消息条数
    // this.getUnreadMessageCount()
  }
}
</script>
