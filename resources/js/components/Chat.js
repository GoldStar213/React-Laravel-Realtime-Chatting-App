
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
import { connect }from 'react-redux';
import PropTypes from "prop-types";
import {  getDmUsers, getChannels, getMessages, dmSelectAction, channelSelect, getUsersList} from '../actions/chatActions';
import { echoInit, sendMessage } from './utils/echoHelpers';
import ChatMessageList from './ChatMessageList';
import ChatDmUsersList from './ChatDmUserList';
import AllUsersList from './AllUsersList';

import ChatChannelsList from './ChatChannelsList';
import ChatRoomUsersList from './ChatRoomUsersList';
import CreateChannelModal from './CreateChannelModal';
import '../../css/custom.css';
import NavbarMain from './NavbarMain';
import ChatInputBox from './ChatInputBox';

    class Chat extends Component {

        state = {
          messages:[],
          message:"",
          users: [],
          allUsers: [],
          currUser:"",
          selectedChannel:""

      }

      static propTypes = {
        // isAuth: PropTypes.func.isRequired,
        getDmUsers: PropTypes.func.isRequired,
        getChannels: PropTypes.func.isRequired,
        getMessages: PropTypes.func.isRequired,
        dmSelectAction: PropTypes.func.isRequired,
        channelSelect: PropTypes.func.isRequired,
        messages: PropTypes.array.isRequired,
        usersInRoom: PropTypes.array.isRequired,
        dmUsers: PropTypes.array.isRequired,
        message: PropTypes.object.isRequired,
        currUser: PropTypes.object.isRequired,
        selectedChannel: PropTypes.object.isRequired,
        usersList: PropTypes.array.isRequired,
      };


      constructor(props) {
        super(props);
        this.myToken = localStorage.token;
        window.token = localStorage.LRC_Token;
        this.fakeGeneralChannel = 5;
        this.dmSelect = this.dmSelect.bind(this);

    }

      componentDidMount () {


          // this.props.isAuth();
          // console.log(this.props.location.state.token);

          echoInit(this.myToken);

          this.props.getDmUsers();
          this.props.getUsersList();
          this.props.getChannels();
          this.channelSelect(this.fakeGeneralChannel);


      }

      dmSelect(id){
        this.props.dmSelectAction(id)
      }


      channelSelect = (selectedChannel, event) => {
        if(event !== undefined) {
          event.stopPropagation();
        }
        this.props.channelSelect(selectedChannel);
      }

      

      onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      };

      // Calls action to register user
      sendMessageWrapper = (e) => {
        e.stopPropagation();
        console.log(this.state.message);
        sendMessage(this.state.message, this.props.selectedChannel.id, this.props.selectedChannel.type)
        this.setState({ message:'' });

      }

      render () {
        return (
            <Container fluid="true">
                <NavbarMain />
                <Row className="fullHeight">
                    <Col xs="2" className="sidenav">
                        <ChatChannelsList
                            channels={this.props.channels}
                            currUser={this.props.currUser}
                            channelSelect={this.channelSelect}
                        />

                        <ChatDmUsersList
                            dmUsers={this.props.dmUsers}
                            currUser={this.props.currUser}
                            dmSelect={this.dmSelect}
                        />
                        <AllUsersList
                            dmUsers={this.props.usersList}
                            currUser={this.props.currUser}
                            sendRequest={this.sendRequest}
                        />
                    </Col>
                    <Col xs="7" className="chatMainContainer">
                        <h1>Chat Homepage</h1>

                        <ChatMessageList
                            messages={this.props.messages}
                            currUser={this.props.currUser}
                        />
                        <ChatInputBox
                            selectedChannel={this.props.selectedChannel}
                        />
                    </Col>
                    <ChatRoomUsersList usersInRoom={this.props.usersInRoom} />
                </Row>
            </Container>
        );
      }
    }

    const mapStateToProps = (state) => ({ //Maps state to redux store as props

      authState: state.auth,
      messages:state.chat.messages,
      message:state.chat.message,
      usersInRoom: state.chat.usersInRoom,
      dmUsers: state.chat.dmUsers,
      channels: state.chat.channels,
      currUser:state.auth.currUser,
      selectedChannel:state.chat.selectedChannel,
      usersList: state.chat.usersList,
    });
    export default connect(mapStateToProps, {getDmUsers, getChannels, getMessages,dmSelectAction, channelSelect,  getUsersList})(Chat);