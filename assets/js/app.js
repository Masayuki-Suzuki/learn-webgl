import DOM from './store/dom'
import creater from './modules/creater'
import matIV from './plugins/minMatrix';

(() => {
  const c = DOM.canvas
  const gl = c.getContext('webgl') || c.getContext('experimental-webgl')
  c.window = 500
  c.height = 300
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const crt = new creater(gl)
  const v_shader = crt.create_shader('vs')
  const f_shader = crt.create_shader('fs')
  const prg = crt.create_program(v_shader, f_shader)

  const attLocation = gl.getAttribLocation(prg, 'position')
  const attStride = 3
  const vertex_position = [0.0, 1.0, 0.0, 1.0, 0.0, 0.0, -1.0, 0.0, 0.0]

  const vbo = crt.create_vbo(vertex_position)
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.enableVertexAttribArray(attLocation)
  gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0)

  const m = new matIV()
  const mMatrix = m.identity(m.create())
  let vMatrix = m.identity(m.create())
  let pMatrix = m.identity(m.create())
  let mvpMatrix = m.identity(m.create())

  vMatrix = m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix)
  pMatrix = m.perspective(90, c.width / c.height, 0.1, 100, pMatrix)
  mvpMatrix = m.multiply(pMatrix, vMatrix, mvpMatrix)
  mvpMatrix = m.multiply(mvpMatrix, mMatrix, mvpMatrix)

  const uniLocation = gl.getUniformLocation(prg, 'mvpMatrix')
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  gl.flush()
})()
