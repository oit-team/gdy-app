<template>
  <div class=" bg-[#F9F9F9]">
    <van-sticky>
      <Header title="录入商品" />
    </van-sticky>
    <div>
      <van-form @submit="onSubmit">
        <van-field
          v-model="form.username"
          name="商品名称"
          label="商品名称"
          placeholder="请输入商品名称"
          :rules="[{ required: true, message: '请填写商品名称' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="吊牌价格"
          label="吊牌价格"
          placeholder="请输入吊牌价格"
          :rules="[{ required: true, message: '请填写吊牌价格' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="商品价格"
          label="商品价格"
          placeholder="请输入商品价格"
          :rules="[{ required: true, message: '请填写商品价格' }]"
        />
        <van-field name="数量" label="数量">
          <template #input>
            <van-stepper v-model="form.stepper" />
          </template>
        </van-field>
        <van-field name="商品图片" label="商品图片">
          <template #input>
            <van-uploader
              v-model="form.uploader"
              :after-read="afterRead"
              :max-count="1"
              :max-size="800 * 1024"
              @oversize="onOversize"
            />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
export default {
  name: 'SelectNotInProduct',
  components: {
    Header,
  },
  data: ()=>({
    form:{
      username: '',
      password: '',
      stepper: 1,
      uploader: [{ url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }],
    }
  }),
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    },
    onOversize(file) {
      console.log(file);
      this.$toast('文件大小不能超过 800kb');
    },
    onSubmit(values) {
      console.log('submit', values);
    },
  },
}
</script>

<style lang='scss' scoped>

</style>
