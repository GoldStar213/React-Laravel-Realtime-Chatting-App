
    import React, { Component } from 'react'
    import {
      Button,
      InputGroup,
      InputGroupAddon,
      Input,
      Container,
      Row,
      Col
    } from 'reactstrap';
    import Echo from 'laravel-echo'

    class Chat extends Component {

        state = {
          messages:[],
          message:"",
          users: [],
          allUsers: [],
          currUser:"",
          selectedChannel:""

      }

      constructor(props) {
        super(props);
        this.myToken = localStorage.getItem("LRC_Token");
    }

      componentDidMount () {



          axios.defaults.headers.common["Authorization"] =
          "Bearer " + this.myToken;

          axios.get("/api/auth/user")
          .then((res) =>{
            // if(res.status === 201) {
              console.log(res.data);
              this.setState({
                currUser:  res.data
              });
              this.setState({
                selectedChannel: 5
              })

            // }
          })
          .catch((err) => {

          });


          window.Pusher = require('pusher-js');


          window.Echo = new Echo({
              broadcaster: 'pusher',
              key: process.env.MIX_PUSHER_APP_KEY,
              wsHost: window.location.hostname,
              wsPort: 6001,
              disableStats: true,
              forceTLS: false
          });

          window.Echo.connector.options.auth.headers['Authorization'] = 'Bearer ' + this.myToken
          window.Echo.options.auth = {
            headers: {
                Authorization: 'Bearer ' + this.myToken,
            },
          }

          window.Echo.join('chat')
          .here(users => {

            console.log(users);
            this.setState({
              users: [...this.state.users, ...users ]
            });

            this.getMessages();

            })
            .joining(user => {

              console.log("JOINING: "+user.name);
              this.setState({
                  users: [...this.state.users, user ]
                });

                const message = {
                  user: user,
                  message: "Joined",
                  status:true
                }
                this.setState({
                  messages: [...this.state.messages, message ]
                });


            })
            .leaving(user => {
              console.log("LEAVING: "+user.name);
                this.setState({
                  users: this.state.users.filter(u => u.id !== user.id)
                });

                const message = {
                  user: user,
                  message: "Left",
                  status:true
                }
                this.setState({
                  messages: [...this.state.messages, message ]
                });

            })

            .listen("MessageSent", (event) => {
            console.log(event);
            const message = {
              user: event.user,
              message: event.message.message
            }
            this.setState({
              messages: [...this.state.messages, message ]
            });
          })
        // }



            const headers = {
              headers: {
                "Authorization":"Bearer "+this.myToken
              }
            };

            axios.get("/api/allusers", headers)
              .then((res) =>{
                console.log(res.data);
                const users = res.data;
                this.setState({
                  allUsers: [...this.state.allUsers, ...users ]
                });
              })
              .catch((err) => {
              });
      }

      messageList() {
        const messages = this.state.messages;
        // console.log(typeof(messages));
        const messagelist = messages.map((value, index) => {
          // console.log(value)
          if(value.status === true) {
            return <Col className="my-3" key={index} sm="6" md={{size: 8, offset: 3}}><strong>{value.user.name}</strong> has <span className="text-primary">{value.message}</span> the channel</Col>
          } else {
            return <Row>
              <Col key={index}><b>{value.user.name }  &lt; { value.user.email }  &gt;  :</b> <br></br> {value.message}</Col>
              </Row>
          }
        });

        return messagelist;
      }


      userList() {
        const users = this.state.users;
        // console.log(typeof(users));

        const userList = users.map((value, index) => {
          console.log(value)
          return <li key={index}><b>{value.name }</b></li>
        });

        return userList;
      }

      allUserList() {
        console.log("CURRENT USER BELOW ");
        console.log(this.state.currUser);
        const users = this.state.allUsers.filter(u => u.id !== this.state.currUser.id);
        // console.log(typeof(users));

        const userList = users.map((value, index) => {
          return <Col> <Button onClick={this.dmSelect.bind(this, value.id)} id={value.id} key={index}><b>{value.name }</b></Button>
          <br></br>
          </Col>
        });

        return userList;
      }

      dmSelect = (id, event ) => {
        event.stopPropagation();
        console.log(id);

        const body = `{ "receiver": ${id} }`;

        const headers = {
          headers: {
            "Content-Type": "application/json"
          }
        };


        axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.myToken;

        console.log(body);
        axios
          .post("/api/directmessage", body, headers)
          .then((res) =>{
             console.log(res.data);
             this.setState({ selectedChannel: res.data.id});
             this.setState({ messages: []});
             this.getMessages();
             window.Echo.join(`chat.dm.${this.state.selectedChannel}`)
            .listen("MessageSent", (event) => {
                console.log(event);
                const message = {
                  user: event.user,
                  message: event.message.message
                }
                this.setState({
                  messages: [...this.state.messages, message ]
                });
           });
          })
          .catch((err) => {
            const errors = err.response.data.errors;
            console.log(errors);
            Object.values(errors).map( error => {
              console.log(error.toString());
            });
          });
      }

      channelSelect = (id, event) => {
        event.stopPropagation();
        this.setState({ selectedChannel: id}, () => {
          this.setState({ messages: []});
          this.getMessages()
        });

;
      }

      onLogout = () => {

            const headers = {
              headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+this.myToken
              }
            };

            axios.get("/api/auth/logout", headers)
              .then((res) =>{
                if(res.status === 200) {
                  window.Echo.disconnect();
                  localStorage.removeItem("LRC_Token");
                  // this.setState({
                  //   redirect: true
                  // })
                  this.props.history.push("/login");
                 }
              })
              .catch((err) => {
              });
      }

      onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      };

      // Calls action to register user
      sendMessage = (e) => {
        e.preventDefault();

        const message = this.state.message;
        const channel_id = this.state.selectedChannel;
        console.log(this.state.selectedChannel);
        const body = JSON.stringify({ message, channel_id });

        const headers = {
          headers: {
            "Content-Type": "application/json"
          }
        };


        axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.myToken;

        console.log(body);
        axios
          .post("/api/messages", body, headers)
          .then((res) =>{
             console.log(res);
          })
          .catch((err) => {
            const errors = err.response.data.errors;
            console.log(errors);
            Object.values(errors).map( error => {
              console.log(error.toString());
            });
          });

      };

      getMessages = () => {
        const headers = {
          headers: {
            "Authorization":"Bearer "+this.myToken
          }
        };

        console.log("CURRENTLY SELECTED CHANNEL BELOW");
        console.log(this.state.selectedChannel)

        axios.get(`/api/messages/${this.state.selectedChannel}`, headers)
          .then((res) =>{

            console.log("GET MESSAGES OUTPUT BELOW");
            console.log(res.data);
            const messages = res.data;
            this.setState({
              messages: [...this.state.messages, ...messages ]
            });
          })
          .catch((err) => {
          });
      }


      render () {

        return (
          <div>
          <Container fluid="true">
            <Row>
            <Col xs="3">
              <h3>Channels</h3>
               <Col> <Button onClick={this.channelSelect.bind(this, 5)} id="5" key="5"><b> General</b></Button>
          <br></br>
          </Col>
                <h3>Direct Message</h3>
                  {this.allUserList()}
              </Col>
              <Col xs="6">
                <h1>Chat Homepage</h1>
                <Button onClick={this.onLogout}>Logout</Button>
                  {this.messageList()}
                <InputGroup>
                <Input onChange={this.onChange} id="message" name="message" />
                  <InputGroupAddon addonType="append"><Button onClick={this.sendMessage}>Send </Button></InputGroupAddon>
                </InputGroup>
              </Col>
              <Col xs="3">
                <h3>Users in this Room</h3>
                <ul>
                  {this.userList()}
                </ul>
              </Col>
            </Row>
          </Container>
          </div>
        )
      }
    }

    export default Chat