export const getHealthyState = (score) => {
  // 获取健康状态
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

export const totalFoot = 30000;
export const totalSportTime = 120;
export const totalSleepTime = 8;
