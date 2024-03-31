import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

// Write your code here

class GithubPopularRepos extends Component {
  state = {
    apisStatus: apiStatusConstants.initial,
    activeLanguageFilterId: languageFiltersData[0].id,
    repositoryData: [],
  }

  componentDidMount() {
    this.getRepos()
  }

  getRepos = async () => {
    const {activeLanguageFilterId} = this.state
    this.setState({
      apisStatus: apiStatusConstants.inprogress,
    })
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.popular_repos.map(eachone => ({
        id: eachone.id,
        imageUrl: eachone.avatar_url,
        starsCount: eachone.stars_count,
        forksCount: eachone.forks_count,
        issuesCount: eachone.issues_count,
      }))
      this.setState({
        repositoryData: updatedData,
        apisStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apisStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader color="#80ed99" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="error-message">Something Went Wrong</h1>
    </div>
  )

  renderReposListView = () => {
    const {repositoryData} = this.state

    return (
      <ul className="repositories-list">
        {repositoryData.map(eachItem => (
          <RepositoryItem key={eachItem.id} repositoryDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderRepos = () => {
    const {apisStatus} = this.state

    switch (apisStatus) {
      case apiStatusConstants.success:
        return this.renderReposListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  setActiveLanguageFilterId = newFilterId => {
    this.setState({activeLanguageFilterId: newFilterId}, this.getRepos)
  }

  renderLanguageFilersList = () => {
    const {activeLanguageFilterId} = this.state
    console.log(activeLanguageFilterId)
    return (
      <ul className="filters-list">
        {languageFiltersData.map(eachItem => (
          <LanguageFilterItem
            key={eachItem.id}
            isActive={eachItem.id === activeLanguageFilterId}
            languageFilterDetails={eachItem}
            setActiveLanguageFilterId={this.setActiveLanguageFilterId}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="heading">Popular</h1>
          {this.renderLanguageFilersList()}
          {this.renderRepos()}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
