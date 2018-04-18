export default class Creater {
  constructor(context) {
    this.gl = context
  }
  create_shader(id) {
    let shader
    const scriptElement = document.getElementById(id)
    if (!scriptElement) {
      return
    }
    switch (scriptElement.type) {
      case 'x-shader/x-vertex':
        shader = this.gl.createShader(this.gl.VERTEX_SHADER)
        break
      case 'x-shader/x-fragment':
        shader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        break
      default:
        return
    }
    this.gl.shaderSource(shader, scriptElement.text)
    this.gl.compileShader(shader)
    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      return shader
    }
    console.error(this.gl.getShaderInfoLog(shader))
  }
  create_program(vs, fs) {
    const program = this.gl.createProgram()
    this.gl.attachShader(program, vs)
    this.gl.attachShader(program, fs)
    this.gl.linkProgram(program)
    if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      this.gl.useProgram(program)
      return program
    }
    console.error(this.gl.getProgramInfoLog(program))
  }
  create_vbo(data) {
    const vbo = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    return vbo
  }
}
