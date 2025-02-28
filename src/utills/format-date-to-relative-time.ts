import moment from "moment";

export const formatDateToRelativeTime = (dateString: any) => {
    const date = moment(dateString).toISOString();
    const relativeTime = moment(date).fromNow(true);
    return relativeTime;
  }