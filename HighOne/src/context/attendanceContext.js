import React, { createContext, useState, useEffect, useContext } from "react"
import { classApi } from "apis/ClassListApi"
import { AttendanceApi } from "apis/AttendanceApi"
import { SessionContext } from "./sessionContext"
export const AttendanceContext = createContext()

const AttendanceProvider = props => {
  const { Session } = useContext(SessionContext)
  let session_id = Session || sessionStorage.getItem("SessionId")

  const currentDate = new Date()
  const formattedDate = convertDate(currentDate.toISOString().slice(0, 10))

  //  take data from localstorage
  var myValue = JSON.parse(localStorage.getItem("User"))
  let teacher_code = myValue?.payload?.t_code ? myValue?.payload?.t_code : ""
  let get_class = myValue?.payload?.home_class
    ? myValue?.payload?.home_class
    : ""
  let get_section = myValue?.payload?.home_sec ? myValue?.payload?.home_sec : ""
  let class_teacher_classwise = `${get_class} ${get_section}`
  const [studentList, setStudentList] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(formattedDate)

  let attendanceDate = studentList?.attendence_date
  const [classList, setClassList] = useState([])
  const [subjectList, setSubjectList] = useState([])
  let classListOption = classList?.filter((list, index, arr) => {
    return index === arr.findIndex(d => d.label === list.label)
  })
  const [classSelect, setClassSelect] = useState(class_teacher_classwise)

  function convertDate(data) {
    const dateString = data
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    return formattedDate
  }

  let handleclassselect = e => {
    setIsLoading(true)
    setStudentList([])
    setClassSelect(e.target.value)
  }
  const str = classSelect
  const parts = str.split(" ")
  let sel_class = parts[0]
  let sel_section = parts[1]
  let class_teacher = classSelect == class_teacher_classwise
  let st_class = sel_class ? sel_class : get_class
  let st_sec = sel_section ? sel_section : get_section

  useEffect(() => {
    classApi
      .getAllClass()
      .then(res => {
        if (myValue == "Admin") {
          setClassList(
            res?.data?.section_list?.map(cl => {
              return {
                value: cl.UID,
                label: `${cl.st_class} ${cl.st_sec}`,
              }
            })
          )
          setSubjectList(res.data?.subject?.map(sub=>{
            return{
              value:sub.uid,
              label:sub.subject_name
            }
          }))
        }
      })
      .catch(err => {
        console.log(err)
      })
    if (myValue != "Admin") {
      setClassList(
        myValue?.teacher_subject?.map(cl => {
          return {
            value: cl.uid,
            label: `${cl.st_class} ${cl.st_sec}`,
          }
        })
      )
    }
  }, [])
  const handleDateChange = data => {
    setIsLoading(true)
    setStudentList([])
    const date = new Date(data)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    setSelectedDate(convertDate(formattedDate))
  }

  function attendanceListDate(data) {
    const date = new Date(data)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
  }

  var attendence_date = attendanceListDate(selectedDate)
  let data = {
    st_class,
    st_sec,
    attendence_date,
    teacher_code,
    session_id,
  }
  function getList(data) {
    AttendanceApi.getAllStudentList(data)
      .then(res => {
        setStudentList(res.data)
        setIsLoading(false)
        localStorage.setItem("myattendance", JSON.stringify(res.data))
      })
      .catch(err => {
        const savedData = JSON.parse(localStorage.getItem("myattendance"))
        setStudentList(savedData)
        setIsLoading(false)
        console.log(err)
      })
  }
  useEffect(() => {
    getList(data)
  }, [selectedDate, st_class, st_sec, session_id])

  return (
    <AttendanceContext.Provider
      value={{
        handleclassselect,
        classListOption,
        studentList,
        setStudentList,
        convertDate,
        attendanceDate,
        st_class,
        st_sec,
        studentList,
        setStudentList,
        convertDate,
        attendanceDate,
        st_class,
        st_sec,
        isLoading,
        handleclassselect,
        classListOption,
        selectedDate,
        handleDateChange,
        class_teacher,
        getList,
        data,
        classSelect,
        attendence_date,
        setIsLoading,
        session_id
      }}
    >
      {props.children}
    </AttendanceContext.Provider>
  )
}
export const useClass = () => {
  return useContext(AttendanceContext)
}

export default AttendanceProvider
