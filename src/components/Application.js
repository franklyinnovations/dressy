import React from "react";
import { connect } from "react-redux";
import { ProgressBar } from "react-bootstrap";
import Menu from "./common/Menu";
import "../stylesheets/main.scss";
import { App, Page, Section, Hero, Navbar, HorizontalSplit } from "neal-react";

// App component
export class Application extends React.Component {
  // pre-render logic
  componentWillMount() {
    // the first time we load the app, we need that users list
    this.props.dispatch({type: 'USERS_FETCH_LIST'});
  }

  // render
  render() {
    // show the loading state while we wait for the app to load
    const {users, children} = this.props;
    if (!users.length) {
      return (
        <ProgressBar active now={100}/>
      );
    }

    // render
    return (
      <App>
        <div>
          {children}
        </div>
      </App>
    );
  }
}

// export the connected class
function mapStateToProps(state) {
  return {
    users: state.users || [],
  };
}
export default connect(mapStateToProps)(Application);
