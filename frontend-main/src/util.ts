export class generateNumber {
  //ランダムな実数を返す
  static getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  //ランダムな整数を返す
  static getRandomInt(min: number, max: number): number {
    // (max - min + 1) を掛けて整数部分を取得し、min を加えて指定範囲の整数を得る
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
