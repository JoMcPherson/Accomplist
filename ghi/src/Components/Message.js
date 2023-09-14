
export default function Message({ message, user }){
    if (message.type === 'join'){
    return (
        <div className="chatApp__convMessageItem">
            <p>{`A New Champion Has Entered`}</p>
        </div>
    )}

    if (message.type === 'chat'){
    return (
        <div className="chatApp__convMessageItem">
            <div className="chatApp_convMessageValue">
                {message.photo && <img src={message.photo}
                alt=''
                 className="chatApp__convMessageAvatar" />}
                {!message.photo && <img src={'https://w7.pngwing.com/pngs/976/393/png-transparent-question-mark-mystery-miscellaneous-angle-text.png'}
                alt=''
                className='chatApp__convMessageAvatar' />}
                {message.username && <>{`${message.username}: ${message.message}`}</>}
                {!message.username && <>{`Guest: ${message.message}`}</>}
                 </div>
        </div>
    )}

    if (message.type === 'namepass'){
        return(
            <div className="chatApp__convMessageItem">
                <p className="chatApp_convMessageValue">
                    {`Make way for ${message.username}`}
                </p>
            </div>
        )
    }
};

/* MessageItem component - composed of a message and the sender's avatar */
// class MessageItem extends React.Component {
// 	render() {
// 		/* message position formatting - right if I'm the author */
// 		let messagePosition = (( this.props.owner == this.props.sender ) ? 'chatApp__convMessageItem--right' : 'chatApp__convMessageItem--left');
// 		return (
// 			<div className={"chatApp__convMessageItem " + messagePosition + " clearfix"}>
// 				<img src={this.props.senderAvatar} alt={this.props.sender} className="chatApp__convMessageAvatar" />
// 				<div className="chatApp__convMessageValue" dangerouslySetInnerHTML={{__html: this.props.message}}></div>
// 			</div>
// 		);
// 	}
// }
/* end MessageItem component */
/* ========== */
