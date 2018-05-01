import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import queryString from 'query-string'
import Tabs, { Tab } from 'material-ui/Tabs'
import List from 'material-ui/List'
import { CircularProgress } from 'material-ui/Progress'
// import Button from 'material-ui/Button'

import { AppState } from '../../store/app-state'
import Container from '../layout/container'
import TopicListItem from './list-item'
import { tabs } from '../../util/variable-define'


@inject((stores) => { // eslint-disable-line
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
}) @observer
export default class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }

  componentDidMount() {
    const tab = this.getTab()
    this.props.topicStore.fetchTopics(tab)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }

  getTab(search) {
    const newSearch = search || this.props.location.search
    const query = queryString.parse(newSearch)
    return query.tab || 'all'
  }

  bootstrapper() {
    // return new Promise((resolve) => {
    //  setTimeout(() => {
    //    this.props.appState.count = 3
    //    resolve(true)
    //  })
    // })
    const query = queryString.parse(this.props.location.search)
    const { tab } = query
    return this.props.topicStore.fetchTopics(tab || 'all').then(() => {
      return true
    }).catch(() => {
      return false
    })
  }

  changeTab(e, value) {
    this.context.router.history.push({
      pathname: '/index',
      search: `?tab=${value}`,
    })
  }

  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }

  render() {
    const { topicStore } = this.props
    const topicList = topicStore.topics
    const { createdTopics } = topicStore
    const syncingTopics = topicStore.syncing
    const tab = this.getTab()
    const { user } = this.props.appState
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(t => (
              <Tab key={t} label={tabs[t]} value={t} />
            ))
          }
        </Tabs>
        {
          (createdTopics && createdTopics.length > 0) ?
            <List style={{ backgroundColor: '#dfdfdf' }}>
              {
                createdTopics.map((topic) => {
                  topic = Object.assign({}, topic, {
                    author: user.info,
                  })
                  return (
                    <TopicListItem
                      key={topic.id}
                      onClick={() => this.listItemClick(topic)}
                      topic={topic}
                    />
                  )
                })
              }
            </List> :
            null
        }
        <List>
          {
            topicList.map(topic => (
              <TopicListItem
                key={topic.id}
                onClick={() => this.listItemClick(topic)}
                topic={topic}
              />
            ))
          }
        </List>
        {
          syncingTopics ?
            (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '40px 0',
                }}
              >
                <CircularProgress color="accent" size={100} />
              </div>
            ) :
            null
        }
      </Container>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
  topicStore: PropTypes.object.isRequired,
}

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}
