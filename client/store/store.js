/**
 * Created by ljr on 2018-04-19.
 */
import AppState from './app-state'
import TopicStore from './topic-store'

export { AppState, TopicStore }


export default {
  AppState,
  TopicStore,
}

export const createStoreMap = () => { //eslint-disable-line
  return {
    appState: new AppState(),
    topicStore: new TopicStore(),
  }
}
