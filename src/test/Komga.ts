
import { TestSuite, registerDefaultTests } from '@paperback/types'
import { Komga } from '../Komga/main.js'
import sourceInfo from '../Komga/pbconfig.js'

export async function runTests() {
  const suite = new TestSuite('Komga tests')
  registerDefaultTests(suite, Komga, sourceInfo)
  
  await suite.run()
}
                