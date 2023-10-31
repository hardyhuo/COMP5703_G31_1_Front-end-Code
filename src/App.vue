<template>
  <div id="app">
    <el-container>
      <el-header style="background-color: white; border: 1px solid #eee">
        <TopBarComponent></TopBarComponent>
      </el-header>
    </el-container>

    <el-container>
      <el-aside style="overflow: hidden; min-height: 100vh; background-color: white; width: 250px; border: 1px solid #eee">
        <el-menu
            default-active="$route.path" router
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">

          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">Main Page</span>
          </el-menu-item>
          <el-menu-item index="/trans">
            <i class="el-icon-menu"></i>
            <span slot="title">Transcribe Page</span>
          </el-menu-item>
          <el-menu-item index="/upload">
            <i class="el-icon-menu"></i>
            <span slot="title">Upload Page</span>
          </el-menu-item>
          <el-menu-item index="/result">
            <i class="el-icon-menu"></i>
            <span slot="title">Result Page</span>
          </el-menu-item>

        </el-menu>
      </el-aside>

      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<style>
  .el-menu{
    border-right: none !important;
  }
  .el-header{
    display: flex;
    //justify-content: space-between;
  }
  .box{
    display: inline-block;
    margin-left: 50px;
    margin-right: 50px;
    border: 1px solid black;
    padding: 20px;
    box-sizing: border-box;
  }
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .span1{
    margin-top: 12px;
    font-size: x-large;
    text-align: center;
  }
</style>

<script>
  import TopBarComponent from '@/components/TopBarComponent'
  export default {
    components:{
      TopBarComponent
    },

    created(){
      console.log(this.$store)
    },

    data() {
      return{
        headerText: ''
      }
    },
    watch:{
      '$route'(){
        const routeMetaTitle = this.$route.meta.title;
        this.headerText = routeMetaTitle || 'default'
      }
    }
  }
</script>