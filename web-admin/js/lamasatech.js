Janus.log("Lamasatech script file start")

//Get session data (room id , password)
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('roomId');
const roomPassword = urlParams.get('password');

//Auto set session id & password values
document.getElementById("input-session-id").value = roomId
document.getElementById("input-pin").value = roomPassword

//Auto submit form
document.getElementById('login-form').submit()


Janus.log('Lamasatech logs')
Janus.log('url params',urlParams)
Janus.log('login button element',loginBtn)
Janus.log('form element ',document.getElementById('login-form'))
Janus.log('session id input element',document.getElementById("input-session-id"))
Janus.log('session password input element',document.getElementById("input-pin"))
Janus.log('session id input value',document.getElementById("input-session-id").value)
Janus.log('session password input value',document.getElementById("input-pin").value)


Janus.log("Lamasatech script file end")