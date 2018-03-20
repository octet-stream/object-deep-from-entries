type TEntries = Array<[string | number | Array<string | number>, any]>

type TResult = Array<{[key : string] : any} | any>

declare function objectDeepFromEntries(entries : TEntries) : TResult

export default objectDeepFromEntries
