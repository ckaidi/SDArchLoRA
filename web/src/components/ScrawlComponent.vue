<template>
  <img :src="generateBase64Image" alt="" id="generateImg"/>
  <canvas v-show="isCanvasShow" class=" border-0" id="canvas" :width="width" :height="height"
          style="position: absolute">浏览器不支持canvas
    <!-- 如果不支持会显示这段文字 --></canvas>
  <canvas class="visually-hidden" :width="width" :height="height" id="canvasGenerate"/>
  <div>
    <label for="customRange1" class="form-label">画笔大小</label>
    <input type="range" class="form-range" id="customRange1" min="1" max="20" v-model="penWidth">
  </div>
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
    toolsTabList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCanvasShow: false,
      modalMarginTop: 0,
      modalMarginLeft: 0,
      penColor: "#ffffff",
      penWidth: 10,
      penClick: false,
      startAxisX: 0,
      startAxisY: 0,
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
    myModalEl.addEventListener('shown.bs.modal', () => {
      that.init();
      that.modalMarginTop = 0
      const modalDialog = document.getElementById('scrawlModalDialog')
      let style = getComputedStyle(modalDialog)
      that.modalMarginTop += Number(style.getPropertyValue('margin-top').replace("px", ""))
      that.modalMarginLeft = Number(style.getPropertyValue('margin-left').replace("px", ""))
      const bodyHeight = Number(style.getPropertyValue('height').replace("px", ""))

      const modalHeader = document.getElementById('scrawlHeader')
      style = getComputedStyle(modalHeader)
      that.modalMarginTop += Number(style.getPropertyValue('height').replace("px", ""))

      const modalBody = document.getElementById('scrawlModalBody')
      style = getComputedStyle(modalBody)
      // that.modalMarginTop += Number(style.getPropertyValue('padding-top').replace("px", ""))
      const bodyWidth = Number(style.getPropertyValue('width').replace("px", ""))

      const modalContent = document.getElementById('scrawlModalContent')
      style = getComputedStyle(modalContent)
      const contentHeight = Number(style.getPropertyValue('height').replace("px", ""))
      that.modalMarginTop += (bodyHeight - contentHeight) / 2


      const generateImg = document.getElementById('generateImg')
      style = getComputedStyle(generateImg)
      const imgWidth = Number(style.getPropertyValue('width').replace("px", ""))

      const canvas = document.getElementById('canvas')
      canvas.style.left = String((bodyWidth - imgWidth) / 2) + 'px'
      console.log('modalMarginTop', that.modalMarginTop)
      console.log('modalMarginLeft', that.modalMarginLeft)
      that.isCanvasShow = true
    })
  },
  methods: {
    h,
    //页面初始化
    init() {
      let height = this.height;
      let width = this.width;

      let canvas = document.getElementById('canvas'); //获取canvas标签
      let ctx = canvas.getContext("2d");//创建 context 对象
      ctx.fillStyle = 'transparent';//画布背景色
      ctx.fillRect(0, 0, width, height);//在画布上绘制 width * height 的矩形，从左上角开始 (0,0)
      ctx.fillStyle = 'transparent';//画布背景色
      ctx.clearRect(0, 0, this.width, this.height);//在画布上绘制 width * height 的矩形，从左上角开始 (0,0)
      canvas.addEventListener("mousemove", this.drawing); //鼠标移动事件
      canvas.addEventListener("mousedown", this.penDown); //鼠标按下事件
      canvas.addEventListener("mouseup", this.penUp); //鼠标弹起事件
    },
    clearCanvas() {
      let canvas = document.getElementById('canvas'); //获取canvas标签
      let ctx = canvas.getContext("2d");//创建 context 对象
      ctx.fillStyle = 'transparent';//画布背景色
      ctx.clearRect(0, 0, this.width, this.height);//在画布上绘制 width * height 的矩形，从左上角开始 (0,0)
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
      console.log(canvas.offsetTop)
      console.log(this.modalMarginTop)
      console.log(this.startAxisY)
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
      // 获取原始canvas元素和上下文
      const originalCanvas = document.getElementById('canvas');
      const canvas = document.getElementById('canvasGenerate'); //获取canvas标签
      let ctx = canvas.getContext("2d");//创建 context 对象
      //将画板保存为图片格式的函数
      // console.log('=====',img_png_src);//data:image/png;base64,iVBOR.....
      ctx.fillStyle = '#000000';//画布背景色
      ctx.fillRect(0, 0, this.width, this.height);//在画布上绘制 width * height 的矩形，从左上角开始 (0,0)
      ctx.drawImage(originalCanvas, 0, 0);
      return canvas.toDataURL("image/png")
    }
  }
}
</script>

<style>

#canvas {
  border: 2px solid #ff6700;
  cursor: crosshair;
}

</style>
