const cardNumbersFormater = (number: string) => {
  let num = parseInt(number, 10);
    if (num >= 1000 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'k';
      } else if (num >= 1000000 && num < 1000000000) {
        return (num / 1000000).toFixed(1) + 'm';
      } else if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'b';
      } else {
        return num;
      }
}

export default cardNumbersFormater

