export var beautifyString = function (string) {
    var formatted = string.replace(/[_-]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
};
