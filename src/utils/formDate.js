import { format } from "date-fns";
export const formatDate = (date) => {
  // return format(date, "yyyy-MM-dd hh:mm");
  return format(date,"hh:mm")
};
