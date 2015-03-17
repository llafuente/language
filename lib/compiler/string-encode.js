module.exports = function string_encode(str) {
    var i = 0,
        max = str.length,
        j,
        jmax,
        out = [],
        c;

    for (; i < max; ++i) {
        c = new Buffer(str.charAt(i)).toString('hex').toUpperCase();
        //console.log(str[i], c);
        jmax = c.length;
        if (jmax > 2) {
            for (j = 0; j < jmax; j+=2) {
                out.push("\\" + c[j] + c[j + 1]);
            }
        } else {
            out.push(str[i]);
        }
        //console.log(
        //    str[i],
        //    str.charAt(i),
        //    str.charCodeAt(i),
        //    str.charCodeAt(i).toString(16),
        //    new Buffer(str.charAt(i)).toString('base64'),
        //    new Buffer(str.charAt(i)).toString('hex'),
        //    encodeURIComponent(str.charCodeAt(i)),
        //    ("000"+str.charCodeAt(i).toString(16)).slice(-4)
//
        //);
    }
    out.push("\\00");
    return out.join("");
};
