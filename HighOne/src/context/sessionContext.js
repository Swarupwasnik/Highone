import React, { createContext, useState, useEffect } from "react"
import { sessionApi } from "apis/SessionApi"

export const SessionContext = createContext()

const SessionProvider = props => {
  const [SessionData, setSessionData] = useState([])
  var [Session, setSession] = useState("")
 

  useEffect(() => {
    sessionApi
    .GetSession()
    .then(res => {
      setSessionData(res.data.session)
      setSession(res.data.session.find((session)=> session.is_active === true)?.id)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

let handlesessionselect=(e)=>{
  setSession(e.target.value)
  window.sessionStorage.setItem("SessionId", e.target.value)
}

  return (
    <SessionContext.Provider
      value={{ SessionData, setSessionData, Session, setSession,handlesessionselect}}
    >
      {props.children}
    </SessionContext.Provider>
  )
}

export default SessionProvider
