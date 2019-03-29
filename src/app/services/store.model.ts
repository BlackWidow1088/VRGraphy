enum FONTS {
  helvetiker = 'helvetiker',
  optimer = 'optimer',
  gentilis = 'gentilis',
  'droid sans' = 'droid sans',
  'droid serif' = 'droid serif'
}

enum FONT_WEIGHT {
  bold = 'bold',
  regular = 'regular'
}

//  singleton class to store application level information accessible to all classes.
export class Store {
  private static instance: Store;
  private fonts = [{
    fontName: FONTS.optimer,
    fontWeight: FONT_WEIGHT.regular,
    font: null,
  }, {
    fontName: FONTS.optimer,
    fontWeight: FONT_WEIGHT.bold,
    font: null
  }];
  private constructor() {
      // do something construct...
  }
  static getInstance() {
      if (!Store.instance) {
        Store.instance = new Store();
      }
      return Store.instance;
  }
  getFontTypes() {
    return this.fonts;
  }
  get Fonts() {
    return this.fonts.map(item => item.font);
  }
  set Fonts(value) {
    value.forEach((item, index, array) => this.fonts[index].font = item);
  }
}
