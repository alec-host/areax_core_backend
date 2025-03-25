module.exports.formatPhone = (inputPhone) => {
    if(isNumericWithOptionalPlus(inputPhone)){
        if(inputPhone.length > 4){
            if(inputPhone[0] !== "+"){
                return "+"+inputPhone;
            }else{
                return inputPhone;
            }
        }else{
            return "+12345678900000000"; //-force error by setting invalid phone
        }
    }else{
        return "+123456789000000000"; //-force error by setting invalid phone
    }
};

isNumericWithOptionalPlus = (str) => {
    return /^\+?\d+$/.test(str);
}