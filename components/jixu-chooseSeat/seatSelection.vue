<script setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSeat } from '@/api/comm/ticketApi'
import _ from 'lodash'
import { getSelectRect } from '@/packageA/postcard/drawUtil'

const scaleValue = ref(2)
const formData = reactive({
  scenic_id: '',
  play_date: '',
  theater_session_id: '',
  scenic_name: '',
  name: '',
})
const priceArr = ref([])
let seatData = ref([])
const checkSeatData = ref([])
const priceCount = ref(0)
const loading = ref(true)
const scale = ref(0.5)
const position = ref({
  screen: {
    w: 0,
    h: 0,
  },
  min: {
    x: 0,
    y: 0,
  },
  max: {
    x: 0,
    y: 0,
  },
  center: {
    x: 0,
    y: 0,
  },
})
const centerPointPositon = ref({
  x: 0,
  y: 0,
})
onLoad(async (query) => {
  formData.scenic_id = query.scenic_id
  formData.play_date = query.play_date
  formData.theater_session_id = query.id
  formData.scenic_name = query.scenic_name
  formData.name = query.name
  await getData()
})

watch(checkSeatData.value, (value) => {
  console.log('->', value)
  priceCount.value = value.reduce((pre, cur) => {
    return (Number(pre) + Number(cur.price)).toFixed(2)
  }, 0)
})

const getData = async () => {
  const result = await getSeat({
    scenic_id: formData.scenic_id,
    play_date: formData.play_date,
    theater_session_id: formData.theater_session_id,
  })

  priceArr.value = result.data.map((item, index) => {
    return {
      color: index == 1 ? '#2d7ee7' : 'red',
      name: item.name,
      price: item.price,
      image: index == 1 ? '/packageA/static/seat/seat.png' : '/packageA/static/seat/seat_red.png',
    }
  })

  let mergeSeatData1 = mergeSeatData(result.data)
  let minx = _.minBy(mergeSeatData1, (o) => {
    return o.map.x
  }).map.x
  let wutaiIndex = _.findIndex(mergeSeatData1, (o) => {
    return o.name == '舞台'
  })
  console.log('->wutai')
  seatData.value = mergeSeatData1.map((item) => {
    item.map.x = item.map.x - minx + 30
    item.map.y = item.map.y - mergeSeatData1[wutaiIndex].map.h
    item.col = _.maxBy(item.seats, (o) => o.seats.length)?.seats.length
    return item
  })
  let seatMinPositonX = _.minBy(seatData.value, (o) => {
    return o.map.x
  })
  let seatMaxPostionX = _.maxBy(seatData.value, (o) => {
    return o.map.x
  })
  let seatMinPostionY = _.minBy(seatData.value, (o) => {
    return o.map.y
  })
  let seatMaxPostionY = _.maxBy(seatData.value, (o) => {
    return o.map.y
  })

  //中心点的坐标
  let seatCenterPositionX = (seatMinPositonX.map.x + seatMaxPostionX.map.x + seatMaxPostionX.map.w) / 2
  let seatCenterPositionY = (seatMinPostionY.map.y + seatMaxPostionY.map.y + seatMaxPostionY.map.h) / 2
  await nextTick(async () => {
    const rect = await getSelectRect('#moveArea')
    position.value = {
      screen: {
        w: rect.width,
        h: rect.height,
      },
      min: {
        x: seatMinPositonX.map.x,
        y: seatMinPostionY.map.y,
      },
      max: {
        x: seatMaxPostionX.map.x + seatMaxPostionX.map.w,
        y: seatMaxPostionY.map.y + seatMaxPostionY.map.h,
      },
      center: {
        x: seatCenterPositionX,
        y: seatCenterPositionY,
      },
    }
    centerPointPositon.value = {
      x: rect.width,
      y: rect.height,
    }
  })
  setTimeout(() => {
    loading.value = false
  }, 1000)

  // seatData.value = mergeSeatData(result.data).map((item) => {
  //   item.map.x = item.map.x - minSeat.map.x
  //   return item
  // })
}
/**
 *
 * @param {Array} data
 */
const mergeSeatData = (data) => {
  let seatData = []
  data.forEach((item) => {
    let areaMapData = item.areas.map((area) => {
      area.ticketType = item.name
      area.active = false
      return area
    })
    seatData = [...seatData, ...areaMapData]
  })
  return seatData
}
/**
 *
 * @param isOccupy 是否被占用
 * @param status  座位状态
 * @param areaIndex  区域index
 * @param rowIndex  列index
 * @param seatData  座位index
 */
const activeSeat = (isOccupy, status, areaIndex, rowIndex, seatIndex, product_id, product_code) => {
  if (isOccupy) {
    uni.showToast({
      title: '该座位已被占用',
      icon: 'none',
      duration: 1000,
    })
    return
  }
  if (status == 3) {
    return
  }
  seatData.value[areaIndex].seats[rowIndex].seats[seatIndex].active = !seatData.value[areaIndex].seats[rowIndex].seats[seatIndex].active
  let active = seatData.value[areaIndex].seats[rowIndex].seats[seatIndex].active
  if (active) {
    seatData.value[areaIndex].seats[rowIndex].seats[seatIndex]['product_id'] = product_id
    seatData.value[areaIndex].seats[rowIndex].seats[seatIndex]['product_code'] = product_code
    seatData.value[areaIndex].seats[rowIndex].seats[seatIndex]['areaIndex'] = areaIndex
    seatData.value[areaIndex].seats[rowIndex].seats[seatIndex]['rowIndex'] = rowIndex
    seatData.value[areaIndex].seats[rowIndex].seats[seatIndex]['seatIndex'] = seatIndex
    checkSeatData.value.push(seatData.value[areaIndex].seats[rowIndex].seats[seatIndex])
  } else {
    let arrIndex = checkSeatData.value.findIndex((item) => {
      return item.id == seatData.value[areaIndex].seats[rowIndex].seats[seatIndex].id
    })
    checkSeatData.value.splice(arrIndex, 1)
  }
  console.log(checkSeatData.value)
}
const confirmSeat = () => {
  if (checkSeatData.value.length == 0) {
    uni.showToast({ title: '请选择座位', icon: 'none', duration: 1000 })
    return
  }
  uni.redirectTo({
    url: `/packageA/seat/order/order?seats=${JSON.stringify(checkSeatData.value)}&play_date=${formData.play_date}`,
  })
}
const deleteCheckSeat = (index) => {
  let checkSeat = checkSeatData.value.splice(index, 1)
  seatData.value[checkSeat[0].areaIndex].seats[checkSeat[0].rowIndex].seats[checkSeat[0].seatIndex].active = false
  console.log('->', checkSeat)
}
const onScale = (e) => {
  // console.log('->', e)
}
const onMove = (e) => {
  position.value.min = {
    x: e.detail.x,
    y: e.detail.y,
  }
}
const onDemoClick = (index) => {
  if (index == 0) {
    scale.value = scale.value + 0.5
  }
  if (index === 1) {
    scale.value = scale.value - 0.5
  }
}
</script>

<template>
  <div>
    <view class="flex items-center mt-0 h-[75rpx] fixed w-full top-0 z-20 bg-white">
      <view class="flex items-center ml-2 border border-[#e2e4e6] px-2 h-[50rpx] rounded-full" v-for="(item, index) in priceArr" :key="index">
        <view class="w-[23rpx] h-[23rpx] mr-1 flex items-center justify-center">
          <image class="w-full h-full" :src="item.image" />
        </view>
        <view class="text-[20rpx]">{{ item.price }}元</view>
      </view>
    </view>
    <view v-if="loading" class="text-[23rpx] text-gray-500 absolute w-[100vw] h-[100vh] z-50 bg-white flex justify-center items-center">剧场加载中...</view>
    <movable-area id="moveArea" class="movableArea absolute" :scale-area="true" :style="{ left: `${-50}vw`, top: `-${centerPointPositon.y / 3}px` }">
      <movable-view
        @scale="onScale"
        @change="onMove"
        :inertia="false"
        class="movableView absolute"
        :x="centerPointPositon.x / 2"
        :y="centerPointPositon.y / 2 + 100"
        :scale-value="scale"
        out-of-bounds="true"
        direction="all"
        scale-max="1.5"
        :scale="true">
        <view v-if="loading" class="text-[23rpx] text-gray-500 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">剧场加载中...</view>
        <view v-else class="absolute" :style="{ left: -position.center.x + 'px', top: -position.center.y + 'px' }">
          <image class="-translate-x-[80rpx]" :style="{ width: position.center.x * 2 + 90 + 'px', height: position.max.y + 70 + 'px' }" src="/packageA/static/seat/theatbg.png" />

          <!--            每个区域-->
          <view
            class="areaItem absolute flex flex-col justify-between pt-[10rpx]"
            v-for="(item, areaIndex) in seatData"
            :key="item.id"
            :style="{
              fontSize: '12rpx',
              width: `${item.map.w}px`,
              height: `${item.map.h}px`,
              left: `${item.map.x}px`,
              top: `${item.map.y}px`,
              alignItems: item.map.align,
            }">
            <view
              v-if="item.name == '舞台'"
              :style="{ fontSize: '30rpx', width: item.map.w + 'px', height: item.map.h + 'px' }"
              class="text-xl border-[26rpx] border-[#d8d8d8] flex items-center justify-center absolute">
              舞台
            </view>
            <view v-if="item.name == '二楼'" :style="{ fontSize: '30rpx', width: item.map.w + 'px', height: item.map.h + 'px' }" class="text-xl flex items-center justify-center">
              二楼
            </view>
            <!--每个区域中点每一行-->
            <view class="text-[12rpx] flex items-center w-full" :style="{ 'justify-content': item.map.align }" v-for="(row, rowIndex) in item.seats">
              <!--每一个座位-->
              <view
                class="seat text-[4rpx]"
                v-for="(seat, seatIndex) in row.seats"
                :key="seat.id"
                @click="activeSeat(seat.isOccupy, seat.status, areaIndex, rowIndex, seatIndex, item.product_id, item.product_code)">
                <view v-if="seat.status == 3" class="seat-item"> </view>
                <!--                  灰色-->
                <view v-else-if="seat.status == 2 || seat.isOccupy == true" class="seat-item relative">
                  <view class="text-[5rpx] scale-50 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-white">{{ seat.code }}</view>
                  <image class="w-full h-full" src="/packageA/static/seat/seat_gray.png" />
                </view>
                <!--                  蓝色空-->
                <view v-else-if="seat.status == 1 && !seat.active && item.ticketType == '乙级'" class="seat-item relative">
                  <view class="text-[5rpx] scale-50 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-black">{{ seat.code }}</view>
                  <image class="w-full h-full" src="/packageA/static/seat/seat_blue_empty.png" />
                </view>
                <!--                  红色空-->
                <view v-else-if="seat.status == 1 && !seat.active && item.ticketType == '甲级'" class="seat-item relative">
                  <view class="text-[5rpx] scale-50 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-black">{{ seat.code }}</view>
                  <image class="w-full h-full" src="/packageA/static/seat/seat_red_empty.png" />
                </view>
                <!--                  蓝色选中-->
                <view v-else-if="seat.status == 1 && seat.active && item.ticketType == '乙级'" class="seat-item relative">
                  <view class="text-[5rpx] scale-50 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-white">{{ seat.code }}</view>
                  <image class="w-full h-full" src="/packageA/static/seat/seat.png" />
                </view>
                <!--                  红色选中-->
                <view v-else-if="seat.status == 1 && seat.active && item.ticketType == '甲级'" class="seat-item relative">
                  <view class="text-[8rpx] scale-50 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-white">{{ seat.code }}</view>
                  <image class="w-full h-full" src="/packageA/static/seat/seat_red.png" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </movable-view>
    </movable-area>
    <view class="fixed bottom-0 w-full">
      <view class="bg-white overflow-auto p-2 flex items-center" v-if="checkSeatData.length !== 0">
        <view
          class="flex flex-shrink-0 items-center border border-[#e9e9e9] rounded-full w-fit px-[12rpx] py-[10rpx] mb-1 mr-1"
          v-for="(item, index) in checkSeatData"
          :key="item.id">
          <text class="text-[21rpx]">{{ item.row }}排{{ item.code }}号</text>
          <image class="w-[20rpx] h-[20rpx] ml-[15rpx]" src="/packageA/static/seat/close.png" @click="deleteCheckSeat(index)" />
        </view>
      </view>
      <view class="order w-full flex items-center bg-white justify-between z-20">
        <view class="flex items-center">
          <text class="mr-2">总计:</text>
          <text class="text-[#FF4E00] text-[24rpx]" v-if="priceCount !== 0">￥</text>
          <text class="text-[#FF4E00] text-[42rpx]">{{ priceCount === 0 ? '0.00' : priceCount }}</text>
        </view>
        <view>
          <view class="bg-gradient-to-r from-[#509ce8] to-[#2a69d1] w-32 h-10 text-white flex items-center justify-center rounded-3xl" @click="confirmSeat">确认选座</view>
        </view>
      </view>
    </view>

    <!--    <view class="tool">-->
    <!--      <view class="prince text-red-900">¥{{ priceCount == 0 ? '0.00' : priceCount }}</view>-->
    <!--      <view class="px-[22rpx] py-[11rpx] bg-red-900 text-white rounded-full text-[26rpx]" @click="confirmSeat">确认选座</view>-->
    <!--    </view>-->
  </div>
</template>

<style scoped lang="scss">
.order {
  padding: 30rpx 32rpx calc(#{$safe-bottom} + 20rpx) 32rpx;
}
.panelBg {
  background: url('@/packageA/static/seat/theatbg.png') no-repeat;
  background-size: 100% 100%;
}
.seat {
  margin-right: 8rpx;
  &:last-of-type {
    margin-right: 0;
  }
  .seat-item {
    @apply w-[20rpx] h-[20rpx] my-[5rpx];
  }
}
.movableArea {
  margin-top: 20px;
  //width: 90vw;
  width: 200vw;
  height: 200vh;
  background: #f6f7f9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .movableView {
    width: 20rpx;
    height: 20rpx;
    background: red;

    .areaItem {
      --w: 0rpx;
      --h: 0rpx;
      --l: 0rpx;
      --t: 0rpx;
      --align: center;
      font-size: 12rpx;
      width: var(--w);
      height: var(--h);
      left: var(--l);
      top: var(--t);
      align-items: var(--align);
    }
  }
}

.tool {
  bottom: env(safe-area-inset-bottom);
  @apply flex items-center justify-between fixed  w-full px-[20rpx];
}

.seatText {
  font-size: 12rpx;
  white-space: nowrap;
  position: absolute;
  transform: translate3d(1%, 1%, 0) scale(0.3);
  width: 32rpx;
  height: 32rpx;
  line-height: 10rpx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  left: -12rpx;
}
</style>
