import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter , Col} from 'reactstrap';

const InviteUsersModal = (props) => {
  const {
    buttonLabel,
    className,
    dmUsers,
    currUser,
    selectedChannel,
    inviteToChannel,
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const users = dmUsers.filter(u => u.id !== currUser.id);

  const userList = users.map((value, index) => {
    return (

        <Col key={index}>
            <Button color="link"
                id={value.users[0].id}>
              <b>{value.users[0].name}</b>
            </Button>
            <Button color="success"
                onClick={() => inviteToChannel(value.id, selectedChannel.id)}
                id={value.id}>
                <b>Invite User</b>
            </Button>
            <br></br>
            <br></br>

        </Col>
      
    );
});


  return (
    <div>
      <Button color="success" onClick={toggle}>{buttonLabel}</Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}><h1>Invite Users to your Channel</h1></ModalHeader>

        <ModalBody>
          Select Users you wish to invite to your channel
          <h2>Friends</h2>
          {userList}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Send Invites</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default InviteUsersModal;