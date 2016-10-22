/* Values of field - name, email, password must not be empty
if the phone is not empty, check for pattern matching +380xxxxxxxxx
password > 5 symbols*/
function validationOfUser(user) {
    var acceptPhone;
    if (user.phone) {
        acceptPhone = user.phone.search(/(^\+(?:380|7)\w{9}$)/);
    } else {
        acceptPhone = 0;
    }
    if (acceptPhone !== -1) {
        if ((user.name) && (user.name.length > 2)) {
            return validationOfLogin(user);    
        } else {
        
            return {"field": "name","message": "Name should not be empty"};    
        }
    } else {
    
        return {"field": "phone","message": "Wrong number of phone"};    
    }
 }

function validationOfLogin(user) {
    var acceptEmail = user.email.search(/(^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$)/);
    if ((user.email) && (acceptEmail !== -1)) {
        if ((user.password) && (user.password.length > 4)) {
        
            return true;
        } else {
        
            return {"field": "password","message": "Password must be at least 6 characters"};       
        }
        
    } else {
    
        return {"field": "email","message": "Wrong email"};    
    }
}

function validationOfNewPassword(user) {
    if (user.current_password !== user.new_password) {
        
        return {"field": "password","message": "Passwords do not match"};
    } else if ((user.new_password) && (user.new_password.length > 4)) {
        
        return {"field": "password","message": "New password must be at least 6 characters"}; 
    } else {
        
        return true;
    }
}

/*Item must have a price, title at least 3 characters*/
function validationItem(item) {
    if ((item.title) && (item.title.length > 2)) {
        if (item.price) {
            
            return true;    
        } else {
            
            return {"field": "price","message": "Price should not be empty"};
        }
    } else {
        
        return {"field": "item title","message": "Title must be at least 3 characters"};
    }
    
}

exports.validationOfUser = validationOfUser; 
exports.validationOfLogin = validationOfLogin; 
exports.validationOfNewPassword = validationOfNewPassword; 
exports.validationItem = validationItem;