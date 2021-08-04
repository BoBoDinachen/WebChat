import React, { Component } from 'react'
import { adaptionContainerHeight } from '../../utils/dom_utils'
import style from './index.module.scss'
import { Link, Switch, Route,withRouter } from 'react-router-dom'
import Canteen from '../Canteen/index';
import FruitStand from '../FruitStand/index'
import PhotoWall from '../PhotoWall/index'
import Record from '../Record/index'
class Home extends Component {
  state = {
    activeItem: 1,
  }
  componentDidMount() {
    adaptionContainerHeight(this.containerBox);
    this.props.history.push("/home/photo");
  }
  render() {
    return (
      <div className={style.container} ref={(c) => { this.containerBox = c }}>
        <div className={style.topBar}>
          <span>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-sousuo"></use>
            </svg>
          </span>
          <ul>
            <Link to="/home/photo"  className={this.state.activeItem === 1 ? style.activeItem : ''} onClick={() => { this.setState({ activeItem: 1 }) }}>
              晒皂片
            </Link>
            <Link to="/home/fruit" className={this.state.activeItem === 2 ? style.activeItem : ''} onClick={() => { this.setState({ activeItem: 2 }) }}>水果摊</Link>
            <Link to="/home/canteen" className={this.state.activeItem === 3 ? style.activeItem : ''} onClick={() => { this.setState({ activeItem: 3 }) }}>小卖部</Link>
          </ul>
          <span onClick={() => {this.props.history.push("/home/record")}}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-xiangjizhaoxiang"></use>
            </svg>
          </span>
        </div>
        <Switch>
          <Route path="/home/photo" component={PhotoWall}></Route>
          <Route path="/home/fruit" component={FruitStand}></Route>
          <Route path="/home/canteen" component={Canteen}></Route>
          <Route path="/home/record" component={Record}></Route>
        </Switch>
      </div>
    )
  }
}
export default withRouter(Home)