"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createData(data) {
    return data.build(f => f
        .FsFunction("access", e => e
        .FsError("ENOENT"))
        .FsFunction("copyFile", e => e
        .FsError("ENOENT")
        .FsError("EXIST"))
        .FsFunction("readdir", e => e
        .FsError("ENOENT"))
        .FsFunction("readFile", e => e
        .FsError("ENOENT"))
        .FsFunction("rename", e => e
        .FsError("ENOENT")
        .FsError("EXIST"))
        .FsFunction("unlink", e => e
        .FsError("ENOENT"))
        .FsFunction("writeFile", e => e
        .FsError("EXIST")));
}
exports.createData = createData;
