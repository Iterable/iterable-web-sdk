var Functions = /** @class */ (function () {
    function Functions() {
    }
    Functions.checkEmailValidation = function (email) {
        return Functions.emailRegex.test(email);
    };
    Functions.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Functions;
}());
export { Functions };
