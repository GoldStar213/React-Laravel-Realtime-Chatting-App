
    import React, { Component } from 'react'
    import {
      Button,
      InputGroup,
      InputGroupAddon,
      Input,
      Container,
      UncontrolledTooltip,
      DropdownToggle,
      DropdownMenu,
      DropdownItem,

      Row,
      Col
    } from 'reactstrap';
import { connect }from 'react-redux';
import PropTypes from "prop-types";
import {  getDmUsers, getChannels, getMessages, dmSelectAction, channelSelect,
   getUsersList, inviteToChannel, makeRequest, joinChannelRequest, getAllChannelsList } from '../actions/chatActions';
import { echoInit} from './utils/echoHelpers';
import ChatMessageList from './ChatMessageList';
import ChatDmUsersList from './ChatDmUserList';
import AllUsersList from './AllUsersList';
import ChannelDetailsModal from './ChannelDetailsModal';
import ChatChannelsList from './ChatChannelsList';
import ChatRoomUsersList from './ChatRoomUsersList';
import '../../css/custom.css';
import NavbarMain from './NavbarMain';
import ChatInputBox from './ChatInputBox';
import InviteUsersModal from './InviteUsersModal';

import LoadingSpinner from './LoadingSpinner';
import UserControlPanel from './UserControlPanel';


    class Chat extends Component {

        state = {
          messages:[],
          users: [],
          allUsers: [],
          currUser:"",
          selectedChannel:""

      }

      static propTypes = {
        getDmUsers: PropTypes.func.isRequired,
        getChannels: PropTypes.func.isRequired,
        getMessages: PropTypes.func.isRequired,
        inviteToChannel: PropTypes.func.isRequired,
        dmSelectAction: PropTypes.func.isRequired,
        channelSelect: PropTypes.func.isRequired,
        messages: PropTypes.array.isRequired,
        typings: PropTypes.array.isRequired,
        usersInRoom: PropTypes.array.isRequired,
        dmUsers: PropTypes.array.isRequired,
        message: PropTypes.object.isRequired,
        currUser: PropTypes.object.isRequired,
        selectedChannel: PropTypes.object.isRequired,
        usersList: PropTypes.array.isRequired,
        joinChannelRequest: PropTypes.func.isRequired,
        makeRequest: PropTypes.func.isRequired,
        getAllChannelsList: PropTypes.func.isRequired

      };


      constructor(props) {
        super(props);
        this.myToken = localStorage.token;
        window.token = localStorage.LRC_Token;
        this.fakeGeneralChannel = 1;
        this.dmSelect = this.dmSelect.bind(this);
        this.state = { isOpen : false};
        // this.onClickUsersInRoom = this.onClickUsersInRoom.bind(this);
    }

      componentDidMount () {


          // this.props.isAuth();
          // console.log(this.props.location.state.token);

          echoInit(this.myToken);

          this.props.getDmUsers();
          this.props.getUsersList();
          this.props.getChannels();
          this.channelSelect(this.fakeGeneralChannel, 'General',                                 
          "A Public channel where all users can chat freely, \n Users are automatically added to this room upon registration of an account, \n this channel is owned by SYSTEM and not by a normal user",
          );


      }

      dmSelect(id, name, avatar){
        this.props.dmSelectAction(id, name, avatar)
      }


      onClickUsersInRoom = () => {
        this.setState({isOpen: !this.state.isOpen});
      };
      
      channelSelect = (selectedChannel, channelName, desc,  owner_id, owner, owner_avatar, event) => {
        if(event !== undefined) {
          event.stopPropagation();
        }
        this.props.channelSelect(selectedChannel, channelName, desc, owner_id, owner, owner_avatar);
      }

      sendRequest = (id) =>{
        this.props.makeRequest(id)
      }
      
      joinChannelRequestWrapper = (id, type) => {
        this.props.joinChannelRequest(id, type)
      }

      render () {

        let usersInThisRoom;
        let isOpen = this.state.isOpen;
         if(this.props.selectedChannel.type == "channel") {
          if(isOpen) {
            usersInThisRoom = <ChatRoomUsersList selectedChannel={this.props.selectedChannel} usersInRoom={this.props.usersInRoom} />
          } else {
            usersInThisRoom = null;
          }
        }
        return (
            <Container fluid="true">
                <Row className="fullHeight">
                    <Col xs="2" className="sidenav">
                        <UserControlPanel/>
                        <ChatChannelsList
                            channels={this.props.channels}
                            allChannels={this.props.allChannels}
                            currUser={this.props.currUser}
                            channelSelect={this.channelSelect}
                            joinChannelRequest={this.joinChannelRequestWrapper}
                            getAllChannelsList={this.props.getAllChannelsList}

                        />

                        <ChatDmUsersList
                            usersList={this.props.usersList}
                            dmUsers={this.props.dmUsers}
                            currUser={this.props.currUser}
                            dmSelect={this.dmSelect}
                            sendRequest={this.sendRequest}
                            getAllUsersList={this.props.getUsersList}
                        />
                        <Row className="Logo">
                        <h2><span style={{color:'#F05340' }}>Laravel</span> <span style={{color:'#61DBFB'}}> React</span> Chat <i class="far fa-comments" style={{fontSize:'2.5rem'}}></i></h2>
                          <span style={{fontWeight:'500'}}>Made by <a href="https://www.shawndsilva.com">Shawn D'silva</a></span>
                        </Row>
                    </Col>
                    <Col className="chatMainContainer">
        <div className="channelNameContainer">
          <div className="channelName">
          <h1>
          {this.props.selectedChannel.type ==  'channel' ? 
          <span className="channelHash"> # 
          </span> : 
          <span className="userAt" >@ 
        </span> }
            {this.props.selectedChannel.name}
            </h1>
          </div>

          <div className="channelNameButtons">
            { this.props.currUser.id == this.props.selectedChannel.owner_id &&
            <InviteUsersModal   dmUsers={this.props.dmUsers} 
            currUser={this.props.currUser} selectedChannel={this.props.selectedChannel}
            inviteToChannel={this.props.inviteToChannel} /> }

            { this.props.selectedChannel.type == 'channel' &&
            ( 
            <React.Fragment>
            <ChannelDetailsModal channel={this.props.selectedChannel}/> 
            <UncontrolledTooltip placement="bottom" target="MembersList">
                Channel Member's List
            </UncontrolledTooltip>
            <Button id="MembersList" className="channelDescButton" onClick={() => this.onClickUsersInRoom()}>
              <i className="fa fa-users" aria-hidden="true"></i>
          </Button>
            </React.Fragment>
            ) }
            </div>
          </div>

                        <ChatMessageList
                            messages={this.props.messages}
                            currUser={this.props.currUser}
                            users={this.props.selectedChannel.users}
                            sendRequest={this.sendRequest}
                            typings={this.props.typings}
                        />
                        <ChatInputBox
                            selectedChannel={this.props.selectedChannel}
                            currUser={this.props.currUser}
                        />
                    </Col>
                    {usersInThisRoom}
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
      allChannels: state.chat.allChannels,
      typings: state.chat.typings
    });
    export default connect(mapStateToProps, {makeRequest, getDmUsers, getChannels, getMessages,dmSelectAction,
       channelSelect,  getUsersList, inviteToChannel, joinChannelRequest, getAllChannelsList })(Chat);