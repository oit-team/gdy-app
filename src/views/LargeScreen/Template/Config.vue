<template>
  <div class="flex flex-col overflow-hidden h-screen bg-gray-100 config">
    <Header title="模板"></Header>

    <Config ref="config">
      <template slot="tab-after">
        <van-tab title="信息">
          <div class="h-full overflow-auto">
            <van-cell-group inset>
              <van-field label="模板名称" v-model.trim="templateName" placeholder="请输入模板名称" />
            </van-cell-group>
          </div>
        </van-tab>
      </template>
      <template slot="actions">
        <van-button class="!h-10" type="info" block round @click="save">保存</van-button>
      </template>
    </Config>
  </div>
</template>

<script>
import Header from '@/components/comps/header/header'
import Config from '../components/Config.vue'
import { addAdvertsShop, updateAdvertsShop, getAdvertsShopById } from '@/api/largeScreen'
import { keyBy } from 'lodash-es'

export default {
  components: {
    Header,
    Config,
  },

  data: () => ({
    templateName: '',
  }),

  mounted() {
    this.isEdit = !!this.$route.query.id
    if (this.isEdit) {
      this.loadData()
    } else {
      // @deprecated
      // 重置数据
      this.templateName = ''
      this.$refs.config.setFileMap({})
      this.$refs.config.setConfig([])
    }
  },

  methods: {
    async loadData() {
      const res = await getAdvertsShopById({
        advertsShopId: this.$route.query.id,
      })

      this.templateName = res.body.describe
      this.$refs.config.setFileMap(keyBy(res.body.resEntityList, 'id'))
      this.$refs.config.setConfig(res.body.rotationRules, false)
    },
    async save() {
      if (this.templateName === '') {
        return this.$toast('模板名称不能为空')
      }

      const {resId, config} = this.$refs.config.getConfig()

      if (!config.length) {
        return this.$toast('请先添加内容')
      }

      this.isEdit
        ? await updateAdvertsShop({
          advertsShopId: this.$route.query.id,
          describe: this.templateName,
          rotationRules: JSON.stringify(config),
          resId,
        })
        : await addAdvertsShop({
          describe: this.templateName,
          rotationRules: JSON.stringify(config),
          resId,
        })

      this.$toast('保存成功')
      this.$router.back()
    },
  }
}
</script>

<style lang='scss' scoped>
</style>
