<template>
  <div id="canvas-broad">
    <canvas class=" border-0" id="canvas" :width="width" :height="height">浏览器不支持canvas
      <!-- 如果不支持会显示这段文字 --></canvas>
    <!--    <template v-if="!toolsTabList">-->
    <!--      <div class="section">-->
    <!--        <span class="info">选择橡皮擦：</span>-->
    <!--        <button class="btn colorBtn" :style="'background-color:' + backgroundColor + ';'" @click='setPenColor();'>-->
    <!--          {{ backgroundColor }}-->
    <!--        </button>-->
    <!--      </div>-->
    <!--      <div class="section">-->
    <!--        <span class="info">选择画笔大小：</span>-->
    <!--        <progress :value="progressValue"-->
    <!--                  style="cursor: pointer;"-->
    <!--                  id="progress"-->
    <!--                  max="1"-->
    <!--                  :title="progressValue * 100 +'%'"-->
    <!--                  @click="setPenWidth">-->
    <!--        </progress>-->
    <!--        <span style="margin-left: 0.3125rem;">{{ 20 * progressValue }}px</span>-->
    <!--      </div>-->
    <!--      <div class="section">-->
    <!--        <span class="info">输出画板内容到下面的图片：</span>-->
    <!--        <button class="btn" @click="createImage();">EXPORT</button>-->
    <!--      </div>-->
    <!--      <img id="image_png" alt="" style="width: 300px;height: 300px">-->
    <!--    </template>-->
  </div>
</template>

<script>

import {h} from "vue";

export default {
  name: 'JCanvasBroad',
  props: {
    generateBase64Image: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: -1
    },
    width: {
      type: Number,
      default: -1
    },
    defaultPenSize: {
      type: Number,
      default: 4
    },
    toolsTabList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalMarginTop: 0,
      modalMarginLeft: 0,
      penColor: "#ffffff",
      penWidth: 4,
      penClick: false,
      startAxisX: 0,
      startAxisY: 0,
      backgroundColor: "#ffffffaa",
      progressValue: 0.2,
      tabList: [{
        label: '背景颜色',
        id: 'back-ground-color'
      }, {
        label: '画笔颜色',
        id: 'pen-color'
      }, {
        label: '橡皮擦',
        id: 'eraser'
      }, {
        label: '画笔大小',
        id: 'pen-size'
      }, {
        label: '导出图片',
        id: 'export'
      }],
      showTab: 0
    }
  },
  mounted() {
    const that = this
    const myModalEl = document.getElementById('scrawlModal')
    myModalEl.addEventListener('show.bs.modal', event => {
      this.init();
    })
    myModalEl.addEventListener('shown.bs.modal', event => {
      const modalBody = document.getElementById('scrawlModalDialog')
      const style = getComputedStyle(modalBody)
      that.modalMarginTop = Number(style.getPropertyValue('margin-top').replace("px", ""))
      that.modalMarginLeft = Number(style.getPropertyValue('margin-left').replace("px", ""))
    })
  },
  methods: {
    h,
    //页面初始化
    init() {
      const that = this

      let height = this.height;
      let width = this.width;
      if (width === -1) {
        const cbw = document.getElementById('canvas-broad');
        width = cbw.offsetWidth * 0.9;
        height = cbw.offsetHeight * 0.6;
        this.width = width;
        this.height = height;
      }
      this.penWidth = this.defaultPenSize;

      let canvas = document.getElementById('canvas'); //获取canvas标签
      let ctx = canvas.getContext("2d");//创建 context 对象
      ctx.fillStyle = this.backgroundColor;//画布背景色
      ctx.fillRect(0, 0, width, height);//在画布上绘制 width * height 的矩形，从左上角开始 (0,0)
      const img = new Image();
      img.src = this.generateBase64Image;
      img.onload = function () {
        draw();
      }

      function draw() {
        ctx.drawImage(img, 0, 0, that.width, that.height);
      }

      canvas.addEventListener("mousemove", this.drawing); //鼠标移动事件
      canvas.addEventListener("mousedown", this.penDown); //鼠标按下事件
      canvas.addEventListener("mouseup", this.penUp); //鼠标弹起事件
    },
    getWidthSelect(width) {
      if (width === this.penWidth) {
        return "btn bg penBtn fw"
      }
      return "btn bg penBtn"
    },
    getColorSelect(color) {
      if (color === this.penColor) {
        return 'btn colorBtn fw'
      }
      return 'btn colorBtn';
    },
    clearCanvas() {
      const canvas = document.getElementById('canvas'); //获取canvas标签
      const ctx = canvas.getContext("2d");//创建 context 对象
      ctx.fillStyle = this.backgroundColor;//画布背景色
      ctx.fillRect(0, 0, this.width, this.height);//在画布上绘制 600x300 的矩形，从左上角开始 (0,0)
    },
    setPenWidth(event) {
      const progress = document.getElementById('progress');
      this.progressValue = (event.pageX - progress.offsetLeft) / progress.offsetWidth;
      this.penWidth = 20 * this.progressValue;
    },
    //设置画笔颜色
    setPenColor(color = '') {
      if (color === '') this.penColor = this.backgroundColor;
      else this.penColor = color;
    },
    penDown(event) {
      this.penClick = true;
      this.startAxisX = event.pageX;
      this.startAxisY = event.pageY;
    },
    penUp() {
      this.penClick = false;
    },
    drawing(event) {
      if (!this.penClick) return;
      const canvas = document.getElementById('canvas'); //获取canvas标签
      const ctx = canvas.getContext("2d");//创建 contextconst canvas = document.getElementById('canvas');  对象
      const stopAxisX = event.pageX;
      const stopAxisY = event.pageY;
      ctx.beginPath();
      //由于整体设置了水平居中，因此需要做特殊处理：window.screen.availWidth/2 -300
      const cl = canvas.offsetLeft + this.modalMarginLeft;
      const ct = canvas.offsetTop + this.modalMarginTop;
      ctx.moveTo(this.startAxisX - cl, this.startAxisY - ct);//moveTo(x,y) 定义线条开始坐标
      ctx.lineTo(stopAxisX - cl, stopAxisY - ct);//lineTo(x,y) 定义线条结束坐标
      ctx.strokeStyle = this.penColor;
      ctx.lineWidth = this.penWidth;
      ctx.lineCap = "round";
      ctx.stroke();// stroke() 方法来绘制线条
      this.startAxisX = stopAxisX;
      this.startAxisY = stopAxisY;
    },
    createImage() {
      console.log('-------');
      const canvas = document.getElementById('canvas'); //获取canvas标签
      //将画板保存为图片格式的函数
      // console.log('=====',img_png_src);//data:image/png;base64,iVBOR.....
      document.getElementById("image_png").src = canvas.toDataURL("image/png");
    }
  }
}
</script>

<style>

#canvas-broad {
  margin: 0 auto;
  /*text-align: center;*/
}

#canvas {
  border: 2px solid #ff6700;
  cursor: crosshair;
}

#image_png {
  width: 300px;
  height: 150px;
  border: 2px solid #ff6700;
  display: block;
  margin: 10px auto;
}

.section {
  margin-top: 10px;
}

.info {
  color: #f0f;
  font-size: 14px;
  line-height: 40px;
}

</style>
