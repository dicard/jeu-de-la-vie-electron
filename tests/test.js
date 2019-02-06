// A simple test to verify a visible window is opened with a title
var Application = require('spectron').Application
var assert = require('assert')

var app = new Application({
  path: 'main.js'
})

app.start().then(() => {
  // check if the window is visible
  return app.browserWindow.isVisible()
}).then((isVisible) => {
  // verify the window is visible
  assert.equal(isVisible, true)
}).then(() => {
  // get the window's title
  return app.client.getTitle()
}).then((title) => {
  // verify the window's title
  assert.equal(title, 'My App')
}).then(() => {
  // stop the application
  return app.stop()
}).catch((error) => {
  // log any failures
  //eslint-disable-next-line no-console
  console.error('Test failed', error.message)
})