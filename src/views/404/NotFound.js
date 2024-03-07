import React from "react";
import Button from "@material-ui/core/Button";
import vcSubscribePublish from "vc-subscribe-publish";
import Typography from "@material-ui/core/Typography";

export const NotFound = ()=> {
    const onBack = ()=> vcSubscribePublish.public("onNavigate", -1);
    return <div style={{display: 'flex', flexFlow: 'column nowrap', minHeight: '100vh', boxSizing: 'border-box', alignItems: 'center', justifyContent:'flex-start'}}>
        <h2 style={{marginTop: 200}}>404 NOT_FOUND</h2>
        <Typography style={{margin: '20px 0'}} variant = 'body2' color={'textSecondary'}>你来到了本不该来的地方~</Typography>
        <Button onClick={onBack}  variant={'outlined'} color={'primary'}>返回</Button>
    </div>
}
