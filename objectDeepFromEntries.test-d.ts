import {expectType, expectError} from "tsd"

import objectDeepFromEntries from "./objectDeepFromEntries"

expectType<unknown>(objectDeepFromEntries([]))

interface Person {
  name: string
  age: number
}

expectType<Person>(objectDeepFromEntries<Person>([
  ["name", "John Doe"],
  ["age", 28]
]))

interface Developer extends Person {
  skills: string[]
}

expectType<Developer>(objectDeepFromEntries<Developer>([
  ["name", "John Doe"],
  ["age", 28],
  [["skills", 0], "javascript"],
  [["skills", 1], "typescript"],
  [["skills", 2], "node.js"]
]))

expectError(objectDeepFromEntries(["invalid entry"]))

expectError(objectDeepFromEntries([[Symbol("invalid key"), "some value"]]))
