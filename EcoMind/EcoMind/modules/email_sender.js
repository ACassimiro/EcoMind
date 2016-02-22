
function sendEmail(socket, req) {
    /* Betsy you will probably not have to use socket, but the req is the information that is coming from the community page. 
       It is a dictionary. That have the following structure
       { 
            action_type: -- You are not going to use this
            message: {  -- this is the one that you are going to access, so you will do req.message to have the dictionary and then access this other dictionary
                name: $("#nameContact").val(),
                email: $("#emailContact").val(),
                msg: $("#messageContact").val()
            }, 
            user_id: getCookie().client_id  -- you are not going to use


        }
       */

        // write the code to send the email here, you can do whatever you want, import other library or create other functions, just make sure that the first place where it is going to pass it is here.
        // All the time that you modify, to test you need to reload the server. Just give CTRL C in the terminal where the server is running and then execude node app.js again

        console.log(req);
}

function requestListener(socket, req) {
  switch (req.action_type) {
        case 'sendEmail':
            sendEmail(socket, req);
            break;
        default:
            return false;
    }

    return true;
}

exports.requestListener = requestListener;