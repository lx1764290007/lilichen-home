import React from 'react';
import {Avatar} from "@material-ui/core";

const avatarUrl = require("../../assets/default-avatar.png");
export const AvatarDefault = (props)=> {
    return <Avatar alt="avatar" src={avatarUrl} onClick={props.onClick} />
}
