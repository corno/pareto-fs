import * as lf from "lingua-franca"

export type FsFunction = {
    readonly "expected errors": lf.Dictionary<FsError>
}

export type FsError = {
}

export type Data = {
    readonly "functions": lf.Dictionary<FsFunction>
}
