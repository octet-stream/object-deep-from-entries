type Entries = Array<[string | number | Array<string | number>, any]>

type Result = Array<{[key : string] : any} | any> | {[key : string] : any}

declare function objectDeepFromEntries(entries : Entries) : Result

export default objectDeepFromEntries
