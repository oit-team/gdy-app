<template>
  <div class="switch-user">
    <Header title="切换用户">
      <template slot="after">
        <span v-if="Object.keys(savedUsers).length > 0" @click="manage = !manage">{{ manage ? '取消' : '管理' }}</span>
      </template>
    </Header>

    <div class="container">
      <div class="tips">轻触头像以切换账号</div>
      <div class="user-list">
        <div class="user-item active" v-for="user of savedUsers" :key="user.userId" @click="switchUser(user)">
          <img class="avatar" :src="user.headPortrait"/>
          <span class="name">{{ user.nickName !== 'null' ? user.nickName : '未设置姓名' }}</span>
          <van-button
              v-if="currentUserId !== user.userId && manage"
              type="danger"
              style="font-size: 6px; margin-left: auto;"
              @click.stop="deleteUser(user.userId)"
          >删除
          </van-button>
          <span class="current" v-if="currentUserId === user.userId">当前登录</span>
        </div>
        <div class="user-item" @click="plusUser" v-if="Object.keys(savedUsers).length < 3">
          <van-icon class="avatar" name="plus" size="30"/>
          <span class="name">添加用户</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/comps/header/header'
import { Toast } from 'mint-ui'

export default {
  name: 'SwitchUser',

  components: {
    Header,
  },

  data: () => ({
    savedUsers: [],
    currentUserId: '',

    manage: false,
  }),

  activated() {
    this.manage = false
    const storage = { ...localStorage }
    const savedUsers = storage.savedUsers
    this.currentUserId = storage.userId
    if (savedUsers !== undefined) {
      this.savedUsers = JSON.parse(savedUsers)
    } else {
      const currentUserData = storage
      const users = {
        [currentUserData.userId]: currentUserData,
      }
      this.savedUsers = users
      localStorage.setItem('savedUsers', JSON.stringify(users))
    }
  },

  methods: {
    switchUser(user) {
      if (user.userId === localStorage.userId) return

      this.validateLoginEffect(user.userId).then(res => {
        if (res.data.data.static == 0) {
          localStorage.clear()
          for (const [key, value] of Object.entries(user)) {
            localStorage.setItem(key, value)
          }
          this.$router.push({
            name: 'index',
            params: {
              selected: '主页',
            }
          })
          Toast('切换成功')
        } else if (res.data.data.static == 1) {
          Toast('用户不存在')
          this.deleteUser(user.userId)
        }
      })
    },
    deleteUser(userId) {
      const savedUsers = JSON.parse(localStorage.getItem('savedUsers') || {})
      delete savedUsers[userId]
      this.savedUsers = savedUsers
      localStorage.setItem('savedUsers', JSON.stringify(savedUsers))
    },
    plusUser() {
      this.$router.push({ name: 'login', params: { type: 'plus' } })
    },
    validateLoginEffect(userId) {
      let _this = this
      let param = {
        'id': userId,
      }
      return _this.$axios.post('/api/userInfo/checkUserByID', param).then(res => {
        // console.log("验证用户有效性");
        // console.log(res)
        if (res.data.code == '200') {
          return res
        } else {
          Toast('请求失败,请稍后重试!')
          return Promise.reject()
        }
      }).catch(err => {
        Toast('服务超时,请稍后再试!')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.switch-user {
  background-color: var(--gray);
}

.container {
  .tips {
    margin-top: 75px;
    font-size: 25px;
    text-align: center;
  }

  .user-list {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
  }

  .user-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: white;

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 45px;
      width: 45px;
      border-radius: inherit;
      margin-right: 10px;
    }

    .name {
      font-weight: bold;
      font-size: 18px;
    }

    &.active {
      .current {
        position: absolute;
        right: 15px;
        font-size: 0.75em;

        &:after {
          content: '';
          display: inline-block;
          margin-left: 5px;
          width: 10px;
          height: 10px;
          vertical-align: middle;
          border-radius: 50%;
          background-color: #1978FE;
        }
      }
    }
  }
}
</style>
