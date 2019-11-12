
import { DataBuilder } from "./generator/builder"


export function createData(data: DataBuilder) {
    return data.build(f => f
        .FsFunction("access", e => e
            .FsError("ENOENT")
        )
        .FsFunction("copyFile", e => e
            .FsError("ENOENT")
            .FsError("EXIST")
        )
        .FsFunction("readdir", e => e
            .FsError("ENOENT")
        )
        .FsFunction("readFile", e => e
            .FsError("ENOENT")
        )
        .FsFunction("rename", e => e
            .FsError("ENOENT")
            .FsError("EXIST")
        )
        .FsFunction("unlink", e => e
            .FsError("ENOENT")
        )
        .FsFunction("writeFile", e => e
            .FsError("EXIST")
        )
    )
}
