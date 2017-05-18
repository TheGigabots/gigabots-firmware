//Kind of a gross hack to get the correct exports going on.
function __onStart(done) {
    done();
}
function __onRun() {

}

if (typeof onStart !== 'undefined') {
    __onStart = onStart;
}

if (typeof onRun !== 'undefined') {
    __onRun = onRun;
}

module.exports = {
    onStart: __onStart,
    onRun: __onRun
}