type Mode = "int" | "float";

// min 以上 max 未満の数を返す
export const rand = (min: number, max: number, mode?: Mode): number => {
  // mode が "int" ならランダムな整数を返す
  if (mode === "int") {
    return Math.floor(Math.random() * (max - min) + min);
  }
  return Math.random() * (max - min) + min;
};
