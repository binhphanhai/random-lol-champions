import { CHAMPIONS, CHAMPIONS_BY_ROLE } from "./data";

export const random = (n, ignoredList, fromList = CHAMPIONS) => {
  const rs = [];
  for (let i = 0; i < n; i++) {
    const item = fromList[Math.floor(Math.random() * fromList.length)];
    if (rs.includes(item) || ignoredList.includes(item)) {
      i--;
    } else {
      rs.push(item);
    }
  }
  return rs;
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const random2 = (n, ignoredList) => {
  const rs = [];
  Object.values(CHAMPIONS_BY_ROLE).forEach((list) => {
    rs.push(...random(1, [...ignoredList, ...rs], list));
  });
  return shuffle(rs.concat(random(n - 6, [...ignoredList, ...rs])));
};

export const halfRandom = (quantity, ignoredList, bonus) => {
  if (quantity < 6) return [];
  const team1 = random2(quantity, ignoredList);
  const team2 = random2(quantity + bonus, [...ignoredList, ...team1]);
  return team1.concat(team2);
};
