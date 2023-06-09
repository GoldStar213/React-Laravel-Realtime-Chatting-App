import React, { Component } from 'react'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  UncontrolledAlert
} from "reactstrap";
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { login, getUser } from '../actions/authActions';
import {AuthContainer} from './AuthContainer';

class Login extends Component {

  state = {
    name: "",
    email: "",
    password: "",
    msg:""
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    currUser: PropTypes.object.isRequired,
    token: PropTypes.string,
    login: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    status: PropTypes.object.isRequired,

  }

  componentDidUpdate(prevProps) {
    const status = this.props.status;

   if (status !== prevProps.status) {

    if (status.id === "LOGIN_FAIL") {
      this.setState({ msg: status.statusMsg.message });
    }
  }
};

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Calls action to register user
  onSubmit = (e) => {
    e.preventDefault();
    const { email, password} = this.state;

    const user = { email, password};
    this.props.login(user, this.props.history);
    // this.props.history.push(chat)

    //  this.props.getUser();

    // this.setState({isLoading:true});

    // const { name, email, password } = this.state;

    // const body = JSON.stringify({ name, email, password });

    // const headers = {
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // };

    // axios
    //   .post("/api/auth/login", body, headers)
    //   .then((res) =>{
    //    if(res.status === 200) {
    //      console.log(res);
    //       console.log(res.data.user);
    //       localStorage.setItem("LRC_Token", res.data.token);
    //       console.log(localStorage.LRC_Token);
    //       this.props.history.push("/chat")
    //       //  window.location.reload();

    //     }
    //   })
    //   .catch((err) => {
    //     const errors = err.response.data.errors;
    //     console.log(errors);
    //     Object.values(errors).map( error => {
    //       console.log(error.toString());
    //     });
    //   });


  };


  render() {
    return (
      <AuthContainer>
            <Form className="authcard" onSubmit={this.onSubmit}>
              <h1>LOGIN</h1>
              <p>Don't have an account? <a href="register">Register.</a></p>

              {this.state.msg ? (
              <UncontrolledAlert color="danger">{this.state.msg}</UncontrolledAlert>
            ) : null}

              <FormGroup className="text-center">
                <Label className="authlabel"  for="email">E-Mail</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@youremail.com"
                  className="mb-3"
                  bsSize="lg"
                  autocomplete="off"
                  onChange={this.onChange}
                />

                <Label className="authlabel"  for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your Password"
                  className="mb-3"
                  bsSize="lg"
                  autocomplete="off"
                  onChange={this.onChange}
                />
                <Button color="dark" className="mt-5" size="lg" block>
              <span>Login</span> &nbsp;
              <i className="fa fa-arrow-circle-right" aria-hidden="true"></i>
                </Button>
              </FormGroup>
            </Form>
      </AuthContainer>
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  currUser: state.auth.currUser,
  token: state.auth.token,
  status: state.status,

});

export default connect(mapStateToProps, { login,getUser })(withRouter(Login));
