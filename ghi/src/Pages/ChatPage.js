import Chat from "../Components/Chat";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Chatpage({user}){

    console.log('user:', user)

return(
    <>
    <div className='chatpage-container'>
        <div style={{backgroundColor: 'grey'}}>
        <div className="chatpage-spacing"></div>
            <h1 className="socket-chat-header1">Accomplist Talkbox</h1>
            <Chat user={user} />
        </div>
        {/* <!-- Default dropup button --> */}
        {/* <div class="btn-group dropup">
        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropup
        </button>
        <div class="dropdown-menu"> */}
            {/* <!-- Dropdown menu links --> */}
            {/* <div class="dropdown-item">link</div>
            <div class="dropdown-item">link2</div>
        </div>
        <div>
            <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown button
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <ul class="dropdown-item" href="#">Action</ul>
                <ul class="dropdown-item" href="#">Another action</ul>
                <ul class="dropdown-item" href="#">Something else here</ul>
            </div>
            </div>
        </div>
        </div> */}
    </div>
    </>
    )
};
