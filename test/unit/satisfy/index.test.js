import Double from '../../../src/value/double'
import Call from '../../../src/value/call'
import Stubbing from '../../../src/value/stubbing'

let findLastStubbingMatch, invokeCallbacks, deliverOutcome, subject
module.exports = {
  beforeEach: () => {
    findLastStubbingMatch = td.replace('../../../src/satisfy/find-last-stubbing-match').default
    invokeCallbacks = td.replace('../../../src/satisfy/invoke-callbacks').default
    deliverOutcome = td.replace('../../../src/satisfy/deliver-outcome').default

    subject = require('../../../src/satisfy').default
  },
  'finds the last stubbing & returns the executed plan': () => {
    const double = Double.create()
    const call = new Call()
    const stubbing = new Stubbing()
    td.when(findLastStubbingMatch(double, call)).thenReturn(stubbing)
    td.when(deliverOutcome(stubbing, call)).thenReturn('huzzah')

    const result = subject(double, call)

    assert.equal(result, 'huzzah')
    assert.deepEqualSet(stubbing.satisfyingCalls, [call])
    td.verify(invokeCallbacks(stubbing, call))
  },
  'does nothing if no matching stubbing found': () => {
    const double = Double.create()
    const call = new Call()
    td.when(findLastStubbingMatch(double, call)).thenReturn(undefined)

    const result = subject(double, call)

    assert.equal(result, undefined)
    assert.equal(td.explain(deliverOutcome).callCount, 0)
    assert.equal(td.explain(invokeCallbacks).callCount, 0)
  }
}
