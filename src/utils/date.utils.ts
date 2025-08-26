interface CreateDate {
  seconds?: number;
  minutes?: number;
  hours?: number;
}

export const getDate = ({
  seconds = 0,
  minutes = 0,
  hours = 0,
}: CreateDate): Date => {
  const currentDate = new Date();
  const newHours = currentDate.getHours() + hours;
  const newMinutes = currentDate.getMinutes() + minutes;
  const newSeconds = currentDate.getSeconds() + seconds;

  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    newHours,
    newMinutes,
    newSeconds,
  );
};
