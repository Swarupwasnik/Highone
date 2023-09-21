//===== School ============
export const POST_ADMIN_LOGIN = "/Admin/Admin_Login_Api/"
export const POST_TEACHER_LOGIN = "/Teacher/TeacherLogin_Api/"
export const CHANGE_PASSWORD = "/Teacher/Teacher_ChangePassword/"

//======Academic Session======
export const GET_SESSION = "/Teacher/Get_SchoolSession/"
export const ADD_SESSION = "/Admin/Add_SchoolSession/"
export const EDIT_SESSION = "/Admin/Edit_SchoolSession/"
export const DELETE_SESSION = "/Admin/Delete_SchoolSession/"

// Dashboard
export const DASHBOARD = "/Teacher/Dashboard_Api/"

//======Post===========
export const GET_POST = "/Teacher/Get_PostApi/"
export const ADD_POST = "/Teacher/Post_Api/"
export const EDIT_POST = "/Teacher/View_PostApi/"
export const UPDATE_POST = "/Teacher/Edit_PostApi/"
export const DELETE_POST = "/Teacher/Delete_PostApi/"
export const POST_LIKE = "/Teacher/PostLikeUnlikeApi/"
export const POST_REPLAY = "/Teacher/PostCommentReplyApi/"
export const EditCommentReplyApi = "/Teacher/EditCommentReplyApi/"
// export const POST_UNLIKE="/Teacher/PostLikeUnlikeApi/"
export const POST_COMMENT = "/Teacher/PostCommentApi/"
export const DELETE_COMMENT = "/Teacher/Delete_CommentApi/"
export const COMMENT_LIKE_UNLIKE = "/Teacher/CommentLikeUnlike/"
export const COMMENT_BLOCK_UNBLOCK = "/Teacher/RestrictStudent_onPostComment/"

export const GET_CLASS_LIST = "/Teacher/Get_Class_SubjectList/"
// === Test =====
export const CREATE_TEST = "/Teacher/Create_TestApi/"
export const GET_TEST_LIST = "/Teacher/Show_TestQuizApi/"
export const DELETE_TEST = "/Teacher/Delete_TestQuiz/"
export const VIEW_TESTQUE = "/Teacher/View_TestQuestion/"
export const SHOW_TEST_QUESTION = "/Teacher/Show_TestQustion/"
export const GET_NOOF_QUESTION = "/Teacher/Get_NOofQuestion/"
export const GET_TEST_DURATION = "/Teacher/Get_TestDuration/"

// ===== Exam Test ========

export const Add_TestQuizInformation = "/Teacher/Add_TestQuizInformation/"
export const Update_TestQuizInformation = "/Teacher/Update_TestQuizInformation/"
export const Add_TestQuizQuestion = "/Teacher/Add_TestQuizQuestion/"
export const View_TestQuestion = "/Teacher/View_TestQuestion/"
export const Delete_Question = "/Teacher/Delete_Question/"
export const TestQuiz_ActiveInactive = "/Teacher/TestQuiz_ActiveInactive/"
export const Get_TestReport = "/Teacher/Get_TestReport/"
export const GetTestReport_History = "/Teacher/GetTestReport_History/"


// ===== Notes +++++++++=

export const GET_NOTES_LIST = "/Teacher/Show_Notes/"
export const TEACHER_SUBJECT_LIST = "/Teacher/TeacherSubject/"
export const DELETE_NOTES = "/Teacher/Delete_Notes/"
export const CREATE_NOTE = "/Teacher/Upload_Notes/"
export const GET_CLASSWISE_SECTION = "/Teacher/Show_ClasswiesSection/"
export const GET_ALLNOTES_LIST = "/Admin/Show_AllNotes/"

//===== Attendance

export const GET_ATTENDANCE_LIST = "/Teacher/Show_StudentAttendance/"
export const STUDENT_ATTENDANCE = "/Teacher/Student_Attendance/"
export const STUDENT_ATTENDANCE_DETAILS = "/Teacher/StudentAttendance_Details/"
export const Generate_AttendanceReport = "/Teacher/Generate_AttendanceReport/"

export const GET_ACADEMIC_CALENDER = "/Admin/Show_AcademicCalender/"
export const CREATE_ACADEMIC_CALENDER = "/Admin/Add_AcademicCalender/"
export const DELETE_ACADEMIC_CALENDER = "/Admin/Delete_AcademicCalender/"

// admin  circular
export const GET_CIRCULAR = "/Admin/Show_Circular/"
export const CREATE_CIRCULAR = "/Admin/Add_CircularNotice/"
export const UPDATE_CIRCULAR = "/Admin/Edit_CircularNotice/"
export const DELETE_CIRCULAR = "/Admin/Delete_Circular/"
export const SHOW_SINGLE_CIRCULAR = "/Admin/Show_CircularData/"
//  Time-Table
export const ADD_TIMETABLE = "/Admin/Add_Timetable/"
export const GET_TIMETABLE = "/Admin/Get_Timetable/"
export const DELETE_TIMETABLE = "/Admin/Delete_Timetable/"
// Syllabus
export const ADD_SYLLABUS = "/Admin/Add_Syllabus/"
export const GET_SYLLABUS = "/Admin/Show_Syllabus/"
export const DELETE_SYLLABUS = "/Admin/Delete_Syllabus/"
// Holiday
export const ADD_HOLIDAY = "/Admin/Add_Holiday/"
export const GET_HOLIDAY = "/Admin/ShowHoliday/"
export const DELETE_HOLIDAY = "/Admin/Delete_Holiday/"
// Proile Pic
export const Get_UnverifyProfile_Student = "/Admin/Get_UnverifyProfile_Student/"
export const Verify_Profile = "/Admin/Verify_Profile/"

// Annual Result
export const GET_CLASS_SECTION ="/Admin/Get_ClasswieseSection/"
export const GET_CLASS_STUDENT_LIST ="/Admin/Get_StudentClasswise/"
export const GET_CLASSLIST ="/Admin/Get_AllClass/"
export const ADD_RESULT ="/Admin/Add_AnnualResult/"
export const Show_AnnualReport ="/Admin/Show_AnnualReport/"
export const DELETE_RESULT ="/Admin/Delete_AnnualResult/"

export const AddGropofClass ="/Admin/AddGropofClass/"
export const GetGroupofclass ="/Admin/GetGroupofclass/"
export const DeleteGroupofClass ="/Admin/DeleteGroupofClass/"










//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"
// LOGIN
// export const POST_ADMIN_LOGIN = "/Admin/Admin_Login_Api/";
//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login"
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//PRODUCTS
export const GET_PRODUCTS = "/products"
export const GET_PRODUCTS_DETAIL = "/product"

//Mails
export const GET_MAILS_LIST = "/mailslists"
export const SELECT_FOLDER = "/folders"
export const GET_SELECTED_MAILS = "/selectedmails"
export const SET_FOLDER_SELECTED_MAILS = "/setfolderonmail"
export const UPDATE_MAIL = "/update/mail"

//CALENDER
export const GET_EVENTS = "/events"
export const ADD_NEW_EVENT = "/add/event"
export const UPDATE_EVENT = "/update/event"
export const DELETE_EVENT = "/delete/event"
export const GET_CATEGORIES = "/categories"

//CHATS
export const GET_CHATS = "/chats"
export const GET_GROUPS = "/groups"
export const GET_CONTACTS = "/contacts"
export const GET_MESSAGES = "/messages"
export const ADD_MESSAGE = "/add/messages"
export const GET_ALL_USERS = "/Teacher/Get_All_Teacher/"
export const GET_SINGLE_USER = "/Teacher/Get_TeacherData/"
export const UpdateOnlieOfflineStatus = "/Teacher/UpdateOnlieOfflineStatus/"

//ORDERS
export const GET_ORDERS = "/orders"
export const ADD_NEW_ORDER = "/add/order"
export const UPDATE_ORDER = "/update/order"
export const DELETE_ORDER = "/delete/order"

//CART DATA
export const GET_CART_DATA = "/cart"

//CUSTOMERS
export const GET_CUSTOMERS = "/customers"
export const ADD_NEW_CUSTOMER = "/add/customer"
export const UPDATE_CUSTOMER = "/update/customer"
export const DELETE_CUSTOMER = "/delete/customer"

//SHOPS
export const GET_SHOPS = "/shops"

//CRYPTO
export const GET_WALLET = "/wallet"
export const GET_CRYPTO_ORDERS = "/crypto/orders"
export const GET_CRYPTO_PRODUCTS = "/crypto-products"

//INVOICES
export const GET_INVOICES = "/invoices"
export const GET_INVOICE_DETAIL = "/invoice"

// JOBS
export const GET_JOB_LIST = "/jobs"
export const ADD_NEW_JOB_LIST = "/add/job"
export const UPDATE_JOB_LIST = "/update/job"
export const DELETE_JOB_LIST = "/delete/job"

//Apply Jobs
export const GET_APPLY_JOB = "/jobApply"
export const DELETE_APPLY_JOB = "add/applyjob"

//PROJECTS
export const GET_PROJECTS = "/projects"
export const GET_PROJECT_DETAIL = "/project"
export const ADD_NEW_PROJECT = "/add/project"
export const UPDATE_PROJECT = "/update/project"
export const DELETE_PROJECT = "/delete/project"

//TASKS
export const GET_TASKS = "/tasks"

//CONTACTS
export const GET_USERS = "/users"
export const GET_USER_PROFILE = "/user"
export const ADD_NEW_USER = "/add/user"
export const UPDATE_USER = "/update/user"
export const DELETE_USER = "/delete/user"

//Blog
export const GET_VISITOR_DATA = "/visitor-data"

//dashboard charts data
export const GET_WEEKLY_DATA = "/weekly-data"
export const GET_YEARLY_DATA = "/yearly-data"
export const GET_MONTHLY_DATA = "/monthly-data"

export const TOP_SELLING_DATA = "/top-selling-data"

//dashboard crypto
export const GET_WALLET_DATA = "/wallet-balance-data"

//dashboard jobs
export const GET_STATISTICS_DATA = "/Statistics-data"

export const GET_EARNING_DATA = "/earning-charts-data"

export const GET_PRODUCT_COMMENTS = "/comments-product"

export const ON_LIKNE_COMMENT = "/comments-product-action"

export const ON_ADD_REPLY = "/comments-product-add-reply"

export const ON_ADD_COMMENT = "/comments-product-add-comment"

// ============= school point ==========
// export const POST_ADMIN_LOGIN = "/Admin/Admin_Login_Api/";
