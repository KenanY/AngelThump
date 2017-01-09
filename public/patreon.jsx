// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(feathers.socketio(socket))
  .configure(feathers.hooks())
  // Use localStorage to store our login token
  .configure(feathers.authentication({
    storage: window.localStorage
  }));

const Profile = React.createClass({

  logout() {
    app.logout().then(() => window.location.href = '/index.html');
  },

  render() {
    const user = this.props.user;

    return <main className="container">
      <div className="row">
        <div className="col-lg-8 col-lg-offset-4">
          <div className="nav">
            <h3 className="title">Patreon Info</h3>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                <strong>Username</strong>
              </div>
              <div>
                patreon
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="row text-xs-center">
        <a href="#" className="logout btn btn-secondary" onClick={this.logout}>
          Sign Out
        </a>
      </footer>
    </main>

    return <aside>
      <img src={user.avatar || PLACEHOLDER} className="avatar" />
      <span className="username font-600">{user.username}</span>
    </aside>
  }
})

const ProfileApp = React.createClass({
  getInitialState() {
    return {
      user: {}
    };
  },

  componentDidUpdate: function() {
    // Whenever something happened, scroll to the bottom of the chat window
    const node = this.getDOMNode().querySelector('.chat');
    node.scrollTop = node.scrollHeight - node.clientHeight;


  },

  componentDidMount() {
    const userService = app.service('users');
    const cached_user = app.get('user');
    console.log(cached_user._id);

    userService.get(cached_user._id).then(user => this.setState({ user: user }))
    .catch(e => console.error(e));

    userService.on('patched', user => this.setState({user: user}));
  },

  render() {
    return <div>
      <Profile user={this.state.user} />
    </div>
  }
});

app.authenticate().then(() => {
  ReactDOM.render(<div id="app">

    <nav className="nav navbar navbar-full navbar-light nav-inline">
      <a className="navbar-brand" href="/">AngelThump Live Streams</a>
      <ul className="nav navbar-nav">
        <li className="nav-item active">
          <p className="nav-link text-muted text-uppercase">Profile</p>
        </li>
      </ul>
    </nav>

    <ProfileApp />
  </div>, document.body);
}).catch(error => {
  if(error.code === 401) {
    window.location.href = '/login.html'
  }

  console.error(error);
});
