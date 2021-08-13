type EntryKey = string | number

type EntryPath = EntryKey | EntryKey[]

type Entry = [EntryPath, unknown]

type Entries = Entry[]

declare function objectDeepFromEntries(entries: Entries): object | unknown[]

export default objectDeepFromEntries
