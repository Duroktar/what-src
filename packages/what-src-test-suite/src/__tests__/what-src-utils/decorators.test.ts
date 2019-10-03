import { debug } from '@what-src/utils'

// https://stackoverflow.com/questions/41223963/jest-how-to-mock-console-when-it-is-used-by-a-third-party-library
describe('what-src utility decorators', () => {
  describe('debug', () => {
    it('should print a pre and post statement', () => {
      class TestClass {
        public state = 0

        @debug()
        public test() {
          this.state++
        }
      }
      const spy = jest.spyOn(console, 'log').mockImplementation()
      const test = new TestClass()
      expect(console.log).toHaveBeenCalledTimes(0)
      test.test()
      expect(console.log).toHaveBeenCalledTimes(2)
      expect(test.state).toEqual(1)
      spy.mockRestore()
    })
    it('should bail if given invalid arguments', () => {
      function tester(n: any) {
        class TestClass {
          public state = 0

          @debug(n)
          public test() {
            this.state++
          }
        }
        return TestClass
      }
      expect(() => tester('method')).not.toThrow()
      expect(() => tester('class')).toThrow() // not implemented yet
      expect(() => tester('function')).toThrow() // not implemented yet
      expect(() => tester('leroy')).toThrow() // not a valid choice
    })
  })
})
