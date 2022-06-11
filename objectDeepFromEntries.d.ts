type EntryKey = string | number

type EntryPath = EntryKey | EntryKey[]

type Entry = [EntryPath, unknown]

type Entries = Entry[]

declare function objectDeepFromEntries<T = unknown>(entries: Entries): T

export default objectDeepFromEntries
