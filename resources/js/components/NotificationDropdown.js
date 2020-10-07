import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const NotificationDropdown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const { notifications, acceptRequest } = props;

  const notificationsList = notifications.map((value, index) => {
    return (
        <DropdownItem key={index} onClick={() => acceptRequest(value.invite_id)}>
          <span><b>{value.sender_name}</b> {value.desc}</span>
            <br></br>
        </DropdownItem>
    );
});

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret>
       Notifications 
        </DropdownToggle>
      <DropdownMenu>
        <DropdownItem divider />
          {notificationsList}

        
        <DropdownItem divider />
        <DropdownItem className="text-primary text-center">Show All Notifications</DropdownItem>

      </DropdownMenu>
    </Dropdown>
  );
}

export default NotificationDropdown;