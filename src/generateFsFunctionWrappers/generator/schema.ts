import * as LF from "lingua-franca"

export type FsFunction = {
    readonly "expected errors": LF.Dictionary<FsError>
}

export type FsError = {
}

export type Data = {
    readonly "functions": LF.Dictionary<FsFunction>
}
