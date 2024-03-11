import React from "react";
import Button from "@material-ui/core/Button";
import vcSubscribePublish from "vc-subscribe-publish";
import Typography from "@material-ui/core/Typography";

export const Unauthorized = ()=> {
    const onBack = ()=> vcSubscribePublish.public("onNavigate", -2);
    return <div style={{display: 'flex', flexFlow: 'column nowrap', minHeight: '100vh', boxSizing: 'border-box', alignItems: 'center', justifyContent:'flex-start'}}>
        <h2 style={{marginTop: 200}}>403 unauthorized</h2>
        <Typography style={{margin: '20px 0'}} variant = 'body2' color={'textSecondary'}>没有授权访问~</Typography>
        <Button onClick={onBack}  variant={'outlined'} color={'primary'}>返回</Button>
    </div>
}
