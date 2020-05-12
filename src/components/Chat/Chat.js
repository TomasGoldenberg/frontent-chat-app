import React, {useState, useEffect }from "react";
import queryString from "query-string";//catch data in the url
import "./Chat.css"
import io from "socket.io-client";

import InfoBar  from "../InfoBar/InfoBar"

let socket; 


const Chat = ({location})=>{
    const ENDPOINT = "localhost:5000"
    const [name , setName]= useState("");
    const [room , setRoom]= useState("");
    const [message , setMessage]= useState(""); //each message
    const [messages , setMessages]= useState([]);  //store all messages


    

    useEffect(  ()=>{       //sign in / join/disconnect

        const {name, room} = queryString.parse(location.search) //(location comes from react router, and it tell us the current url), location.search , it retrieves us the elements we incrusted in the URL
       
        socket= io(ENDPOINT)
       
        setName(name)
        setRoom(room)

        socket.emit("join",{name, room},()=>{
           // alert(error) //this error callback it come from the socket.on("join") in the backend, this same event but at the server side

        })//this is a socket method to emit a socket from the client side it can have any name , we used join
    
        return ()=>{   //the return is like the unmountcomponent
            socket.emit("disconnect");

            socket.off()//kills this socket instance, it means a user is gone , we wont mind it any more
            }
        },[ENDPOINT, location.search])//this second params means that the useEffect is going to autoreset ONLY when our endpoint or our location.search values had changed


       
    useEffect( ()=>{         //handle messages
        socket.on("message",(message)=>{       //the params came from the message event in the server, the admins messages
            setMessages([...messages , message]) //adding each message to the messages array
        },[])// only restart this useEffect when the messages array updates
    } )
    
       
        const sendMessage = (event)=>{
            
            event.preventDefault();

            if(message){
                socket.emit("sendMessage",message,()=>{
                    setMessage("") //reset message input
                })
            }
        }
    
            console.log(message, messages)
    
    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar  room={room}/>
            <input className="input"
                type="text" 
                value={message} 
                onChange={ (event)=> setMessage(event.target.value)}
                onKeyPress={ (event) =>event.key === "Enter" ? sendMessage(event) : null }/>

            </div>
        </div>
    )
}

export default Chat