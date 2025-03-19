//计算健康指数
const calculateHealthPoint = (healthy,healthyState) => {
  // 归一化步数（假设理想步数为8000）
  const normalizedStepCount = Math.min(healthy.value.stepCount / 8000, 1);
  // 归一化睡眠时长（假设理想睡眠时长为8小时）
  const normalizedSleepTime = Math.min(healthy.value.sleepTime / 8, 1);
  // 归一心率（假设理想心率为60）
  const normalizedHeartRate = Math.min(60 / healthy.value.heartRate, 1);
  // 计算健康指数
  healthy.value.point = Math.round(
    (normalizedStepCount * 0.4 +
      normalizedSleepTime * 0.3 +
      normalizedHeartRate * 0.3) *
      100
  ); // 转换为百分制
  //获取健康指数状态
  healthyState.value = getHealthyState(healthy.value.point);
};
//获取健康指数状态
const getHealthyState = (score) => {
  let state = "";
  if (score >= 80) {
    state = "状态很佳";
  } else if (score < 80 && score >= 60) {
    state = "状态良好";
  } else if (score >= 40 && score < 60) {
    state = "状态一般";
  } else {
    state = "状态一般";
  }
  return state;
};
export {
  calculateHealthPoint,
}