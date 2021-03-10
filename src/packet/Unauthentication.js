function UnAuthen() {
}

module.exports = UnAuthen;

UnAuthen.prototype.build = function() {
    var buf = new ArrayBuffer(1);
    var view = new DataView(buf);
    view.setUint8(0, 101, true);
    return buf;
};
