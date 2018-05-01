import {
  observable,
  toJS,
  action,
} from 'mobx'
import { post, get } from '../util/http'


export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      recentTopics: [],
      recentReplies: [],
      syncing: false,
    },
    collections: {
      syncing: false,
      list: [],
    },
  }

  // init(user) {
  //  if (user) {
  //    this.user = user
  //  }
  // }

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('user/login', {}, {
        accessToken,
      }).then((resp) => {
        if (resp.success) {
          this.user.isLogin = true
          this.user.info = resp.data
          console.log('this.user.info.loginname==38==='+this.user.info.loginname) // eslint-disable-line
          resolve()
        } else {
          reject(resp)
        }
      }).catch(reject)
    })
  }

  @action getUserDetail() {
    console.log('this.user.info.loginname====='+this.user.info.loginname) // eslint-disable-line
    this.user.detail.syncing = true
    return new Promise((resolve, reject) => {
      get(`user/${this.user.info.loginname}`)
        .then((resp) => {
          if (resp.success) {
            this.user.detail.recentReplies = resp.data.recent_replies
            this.user.detail.recentTopics = resp.data.recent_topics
            resolve()
          } else {
            reject()
          }
          this.user.detail.syncing = false
        }).catch((err) => {
          this.user.detail.syncing = false
          reject(err)
        })
    })
  }

  @action getUserCollection() {
    this.user.collections.syncing = true
    return new Promise((resolve, reject) => {
      get(`topic_collect/${this.user.info.loginname}`)
        .then((resp) => {
          if (resp.success) {
            this.user.collections.list = resp.data
            resolve()
          } else {
            reject()
          }
          this.user.collections.syncing = false
        }).catch((err) => {
          this.user.collections.syncing = false
          reject(err)
        })
    })
  }

  toJson() {
    return {
      user: toJS(this.user),
    }
  }
}
