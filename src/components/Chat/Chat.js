import React, {useState, useEffect }from "react";
import queryString from "query-string";//catch data in the url
import io from "socket.io-client";

let socket; 


const Chat = ({location})=>{
    const ENDPOINT = "localhost:5000"
    const [name , setName]= useState("");
    const [room , setRoom]= useState("");
    

    useEffect(  ()=>{
        const {name, room} = queryString.parse(location.search) //(location comes from react router, and it tell us the current url), location.search , it retrieves us the elements we incrusted in the URL
       
        socket= io(ENDPOINT)
       
        setName(name)
        setRoom(room)

        socket.emit("join",{name, room})//this is a socket method to emit a socket from the client side
    },[ENDPOINT, location.search])//this second params means that the useEffect is going to autoreset ONLY when our endpoint or our location.search values had changed

    return(
        <h1>CHat</h1>
    )
}

export default Chat